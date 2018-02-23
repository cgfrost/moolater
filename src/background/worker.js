/* global browser: false */

(function () {
    'use strict';

    console.log('============================= SKIPJAQ =============================');

    window.browser = (function () {
        return window.browser ||
               window.chrome;
    })();

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

            let booleanOption = (option) => {
                return option === undefined ? true : option === true;
            };

            let validSettings = {
                defaultList: settings.defaultList || "Read Later",
                useTitle: booleanOption(settings.useTitle),
                useLink: booleanOption(settings.useLink),
                useSmartAdd: booleanOption(settings.useSmartAdd),
                showContextMenu: booleanOption(settings.showContextMenu),
                frob: settings.frob || 'INVALID',
                token: settings.token || 'INVALID'
            };

            milk = new Skipjaq('write', validSettings.frob, validSettings.token, debugMode);

            if (milk.isUserReady(debugMode)) {
                refreshLists();
                milk.setTimeline(debugMode);
            }

            browser.storage.local.set(validSettings).then(() => {
                browser.storage.onChanged.addListener((changes, area) => {
                    if (area === 'local' && changes.showContextMenu && changes.showContextMenu.oldValue !== changes.showContextMenu.newValue) {
                        if (changes.showContextMenu.newValue) {
                            // addContextMenu();
                        } else {
                            // removeContextMenu();
                        }
                    }
                });

                log(`Storage initialized`);
            });
        }).catch(handleError);
    }

    // Actions

    function authorise(userId, password) {
        let authUrl = milk.getAuthUrl();
        if (isMobile) {
            browser.tabs.create({url: authUrl, active: true}).then((newTab) => {
                log(`Created new tab "${newTab.id}" at ${authUrl}`);
                let tabCloseListener = (tabId) => {
                    log(`Tab remove event for id ${tabId}`);
                    if (tabId === newTab.id) {
                        milk.fetchToken(() => {
                            if (milk.isUserReady(debugMode)) {
                                refreshLists();
                            }
                        }, handleError, debugMode);
                        browser.tabs.onRemoved.removeListener(tabCloseListener);
                    }
                };
                browser.tabs.onRemoved.addListener(tabCloseListener);
            }).catch(handleError);
        } else {
            browser.windows.create({url: authUrl, type: 'panel'}).then((newWindow) => {
                log(`Created new window "${newWindow.id}" at ${authUrl}`);
                let windowCloseListener = (windowId) => {
                    log(`Window remove event for id ${windowId}`);
                    if (windowId === newWindow.id) {
                        milk.fetchToken(() => {
                            if (milk.isUserReady(debugMode)) {
                                refreshLists();
                            }
                        }, handleError, debugMode);
                        browser.windows.onRemoved.removeListener(windowCloseListener);
                    }
                };
                browser.windows.onRemoved.addListener(windowCloseListener);
            }).catch(handleError);
        }
    }

    function addTask(name, link, useSelection, selection, listId) {
        log(`Adding task: ${name}, ${link}, ${useSelection}, ${selection}, ${listId}`);
        milkAction.addTask(milk, debugMode, name, listId).then((resp) => {
            let list = resp.rsp.list;
            let addLinkPromise = link === '' ? true : milkAction.addUrlToTask(milk, debugMode, list, link);
            let addNotePromise = useSelection ? milkAction.addNoteToTask(milk, debugMode, list, 'Selected text from the webpage:', selection) : true;
            Promise.all([addLinkPromise, addNotePromise]).then(() => {
                browser.runtime.sendMessage({action: 'taskAdded', debug: debugMode}).catch(handleMessageError);
            }).catch((error) => {
                browser.runtime.sendMessage({action: 'taskAddedError', debug: debugMode, reason: error.message}).catch(handleMessageError);
            });
        }).catch((error) => {
            browser.runtime.sendMessage({action: 'taskAddedError', debug: debugMode, reason: error.message}).catch(handleMessageError);
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
            browser.runtime.sendMessage(listsRefreshedArguments).catch(handleMessageError);
        }).catch((error) => {
            let listsRefreshedArguments = {
                action: 'listsRefreshedError',
                debug: debugMode,
                lists: lists,
                reason: error.message
            };
            browser.runtime.sendMessage(listsRefreshedArguments).catch(handleMessageError);
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
            browser.runtime.sendMessage(listsRefreshedArguments).catch(handleMessageError);
        }).catch((error) => {
            let listsRefreshedArguments = {
                action: 'listsRefreshedError',
                debug: debugMode,
                lists: lists,
                reason: error
            };
            browser.runtime.sendMessage(listsRefreshedArguments).catch(handleMessageError);
        });
    }

    // Message handler

    function handleMessage(message, sender, sendResponse) {
        log(`Message received in the background script: ${message.action} - ${sender.id}`);
        switch(message.action) {
            case "login":
                authorise(message.userId, message.password);
                break;
            case "refreshDomains":
                sendResponse(milk.isUserReady(debugMode));
                break;
            case "refreshApplications":
                sendResponse(lists);
                break;
            case "saveRecording":
                addTask(message.name, message.link, message.useSelection, message.selection, message.listId);
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