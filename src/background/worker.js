/* global browser: false */

(function () {
    'use strict';

    console.log('============================= MOOLATER =============================');

    let milk = undefined;
    let milkAction = new MilkAction();
    let lists = [];
    let debugMode = false;

    function handleError(error) {
        let errorMessage = error.message ? error.message : error.toString();
        console.warn(`Moo Later, background error: ${errorMessage}`);
    }

    function handleMessageError(error) {
        log(`Error sending to popup ${error.message}`);
    }

    function log(message) {
        if (debugMode) {
            console.log(message);
        }
    }

    function initOptions() {
        browser.storage.local.get().then((settings) => {
            let validSettings = {
                defaultList: settings.defaultList || "Inbox",
                useTitle: settings.useTitle || true,
                useLink: settings.useLink || true,
                useSmartAdd: settings.useSmartAdd || true,
                showContextMenu: settings.showContextMenu || true,
                frob: settings.frob || 'INVALID',
                token: settings.token || 'INVALID'
            };

            let data = '{"a": "bf427f2504b074dc361c18d255354649", "b": "9d98f15fda6ba725"}';
            milk = new Milk(JSON.parse(data), 'write', validSettings.frob, validSettings.token, debugMode);

            if (validSettings.showContextMenu) {
                addContextMenu();
            }

            if (milk.isUserReady(debugMode)) {
                refreshLists();
                milk.setTimeline();
            }

            browser.storage.local.set(validSettings).then(() => {
                browser.storage.onChanged.addListener((changes, area) => {
                    if (area === 'local' && changes.showContextMenu && changes.showContextMenu.oldValue !== changes.showContextMenu.newValue) {
                        if (changes.showContextMenu.newValue) {
                            addContextMenu();
                        } else {
                            removeContextMenu();
                        }
                    }
                });
                log(`Storage initialized`);
            });
        }).catch(handleError);
    }

    // Context Menus

    function addContextMenu() {
        browser.menus.create({
            id: 'moolater',
            type: 'normal',
            title: 'MooLater',
            contexts: ['all']
        }, () => {
            browser.menus.onClicked.addListener(contextMenuListener);
        });
    }

    function removeContextMenu() {
        if (browser.menus.onClicked.hasListener(contextMenuListener)) {
            browser.menus.onClicked.removeListener(contextMenuListener)
        }
        browser.menus.removeAll();
    }

    function contextMenuListener() {
        browser.browserAction.openPopup();
    }

    // Actions

    function authorise() {
        let authUrl = milk.getAuthUrl();
        browser.windows.create({url: authUrl, type: 'panel'}).then((newWindow) => {
            log(`Created new window "${newWindow.id}" at ${authUrl}`);
            let windowListener = (windowId) => {
                log(`Window remove event for id ${windowId}`);
                if (windowId === newWindow.id) {
                    milk.fetchToken(() => {
                        if (milk.isUserReady(debugMode)) {
                            refreshLists();
                        }
                    }, handleError);
                    browser.windows.onRemoved.removeListener(windowListener);
                }
            };
            browser.windows.onRemoved.addListener(windowListener);
        }).catch(handleError);
    }

    function addTask(name, link, useSelection, selection, listId) {
        log(`Adding task: ${name}, ${link}, ${useSelection}, ${selection}, ${listId}`);
        milkAction.addTask(milk, debugMode, name, listId).then((resp) => {
            let list = resp.rsp.list;
            let addLinkPromise = link === '' ? true : milkAction.addUrlToTask(milk, debugMode, list, link);
            let addNotePromise = useSelection ? milkAction.addNoteToTask(milk, debugMode, list, 'Selected text from the webpage:', selection) : true;
            Promise.all([addLinkPromise, addNotePromise]).then(() => {
                browser.runtime.sendMessage({action: 'taskAdded', debug: debugMode}).then(null, handleMessageError);
            }).catch((error) => {
                browser.runtime.sendMessage({action: 'taskAddedError', debug: debugMode, reason: error.message}).then(null, handleMessageError);
            });
        }).catch((error) => {
            browser.runtime.sendMessage({action: 'taskAddedError', debug: debugMode, reason: error.message}).then(null, handleMessageError);
        });
    }

    function refreshLists() {
        log("Refresh lists");
        milkAction.getLists(milk, debugMode).then((resp) => {
            lists = resp.rsp.lists.list;
            let listsRefreshedArguments = {
                action: 'listsRefreshed',
                debug: debugMode,
                lists: lists
            };
            browser.runtime.sendMessage(listsRefreshedArguments).then(null, handleMessageError);
        }).catch((error) => {
            let listsRefreshedArguments = {
                action: 'listsRefreshedError',
                debug: debugMode,
                lists: lists,
                reason: error.message
            };
            browser.runtime.sendMessage(listsRefreshedArguments).then(null, handleMessageError);
        });
    }

    function addList(listName) {
        log(`Adding list: ${listName}`);
        milkAction.addList(milk, debugMode, listName).then((resp) => {
            lists.push(resp.rsp.list);
            let listsRefreshedArguments = {
                action: 'listsRefreshed',
                debug: debugMode,
                lists: lists
            };
            browser.runtime.sendMessage(listsRefreshedArguments).then(null, handleMessageError);
        }).catch((error) => {
            let listsRefreshedArguments = {
                action: 'listsRefreshedError',
                debug: debugMode,
                lists: lists,
                reason: error
            };
            browser.runtime.sendMessage(listsRefreshedArguments).then(null, handleMessageError);
        });
    }

    // Message handler

    function handleMessage(message, sender, sendResponse) {
        log(`Message received in the background script: ${message.action} - ${sender.id}`);
        switch(message.action) {
            case "userReady":
                sendResponse(milk.isUserReady(debugMode));
                break;
            case "authorise":
                authorise();
                break;
            case "addTask":
                addTask(message.name, message.link, message.useSelection, message.selection, message.listId);
                break;
            case "lists":
                sendResponse(lists);
                break;
            case "refreshLists":
                refreshLists();
                break;
            case "addList":
                addList(message.listName);
                break;
            default:
                handleError(`Unrecognised message with query "${message.action}"`);
        }
    }

    initOptions();
    browser.runtime.onInstalled.addListener((details) => {
        debugMode = details.temporary;
        log(`Temporary installation: ${details.temporary}`);
    });
    browser.runtime.onMessage.addListener(handleMessage);

}());