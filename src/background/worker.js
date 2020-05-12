(function () {
    'use strict';

    console.log('============================= MOOLATER =============================');

    const ANDROID = 'android';
    let isMobile = false;
    let milk = undefined;
    let milkAction = new MilkAction();
    let lists = [];
    let userSettings = {};
    let timezoneOffset = 0;
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

            browser.runtime.getPlatformInfo().then((info) => {
                if(ANDROID === info.os) {
                    isMobile = true;
                }

                let data = '{"a": "bf427f2504b074dc361c18d255354649", "b": "9d98f15fda6ba725"}';
                milk = new Milk(JSON.parse(data), 'write', validSettings.frob, validSettings.token, debugMode);

                if (!isMobile && validSettings.showContextMenu) {
                    addContextMenu();
                }

                if (milk.isUserReady(debugMode)) {
                    refreshLists();
                    refreshUserSettings();
                    milk.setTimeline(debugMode);
                }

                browser.storage.local.set(validSettings).then(() => {
                    if(!isMobile) {
                        browser.storage.onChanged.addListener((changes, area) => {
                            if (area === 'local' && changes.showContextMenu && changes.showContextMenu.oldValue !== changes.showContextMenu.newValue) {
                                if (changes.showContextMenu.newValue) {
                                    addContextMenu();
                                } else {
                                    removeContextMenu();
                                }
                            }
                        });
                    }
                    log(`Storage initialized`);
                });
            });
        }).catch(handleError);
    }

    // Context Menus - not supported on Android

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
        if (isMobile) {
            browser.tabs.create({url: authUrl, active: true}).then((newTab) => {
                log(`Created new tab "${newTab.id}" at ${authUrl}`);
                let tabCloseListener = (tabId) => {
                    log(`Tab remove event for id ${tabId}`);
                    if (tabId === newTab.id) {
                        milk.fetchToken(() => {
                            if (milk.isUserReady(debugMode)) {
                                refreshLists();
                                refreshUserSettings();
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
                                refreshUserSettings();
                            }
                        }, handleError, debugMode);
                        browser.windows.onRemoved.removeListener(windowCloseListener);
                    }
                };
                browser.windows.onRemoved.addListener(windowCloseListener);
            }).catch(handleError);
        }
    }

    function addTask(name, link, dueDate, useSelection, selection, listId) {
        log(`Adding task: ${name}, ${link}, ${dueDate}, ${useSelection}, ${selection}, ${listId}`);
        const convertedDueDate = converDueDate(dueDate);
        milkAction.addTask(milk, debugMode, name, listId).then((resp) => {
            let list = resp.rsp.list;
            let postActions = [];
            postActions.push(link === '' ? true : milkAction.addUrlToTask(milk, debugMode, list, link));
            postActions.push(useSelection ? milkAction.addNoteToTask(milk, debugMode, list, 'Selected text from the webpage:', selection) : true);
            postActions.push(convertedDueDate === '' ? true : milkAction.addDueDateToTask(milk, debugMode, list, convertedDueDate));
            Promise.all(postActions).then(() => {
                browser.runtime.sendMessage({action: 'taskAdded', debug: debugMode}).catch(handleMessageError);
            }).catch((error) => {
                browser.runtime.sendMessage({action: 'taskAddedError', debug: debugMode, reason: error.message}).catch(handleMessageError);
            });
        }).catch((error) => {
            browser.runtime.sendMessage({action: 'taskAddedError', debug: debugMode, reason: error.message}).catch(handleMessageError);
        });
    }

    function converDueDate(dueDate) {
        if (dueDate === 'due-never') {
            return '';
        }
        const milliInADay = 86400000;
        const days = Number(dueDate.substr(4));
        const today = new Date(); // No need to use the users timszone offset as everything is now done as UTC.
        return new Date(today.getTime() + (days * milliInADay)).toISOString();
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

    function refreshUserSettings() {
        log("Refresh user settings");
        milkAction.getSettings(milk, debugMode).then((resp) => {
            userSettings = resp.rsp.settings;
            let userSettingsRefreshedArguments = {
                action: 'userSettingsRefreshed',
                debug: debugMode,
                settings: userSettings
            };
            if (userSettings.timezone && userSettings.timezone.length !== 0) {
                milkAction.getTimezoneOffset(milk, debugMode, userSettings.timezone).then((resp) => {
                    // Now calculate and cache the users timezone offset in ms from UTC.
                    let userTime;
                    if (resp.rsp.time.$t.endsWith('Z')) {
                        userTime = new Date(resp.rsp.time.$t); // Use UTC to find the difference.
                    } else {
                        userTime = new Date(`${resp.rsp.time.$t}.000Z`); // Use UTC to find the difference.
                    }
                    const nowTime = new Date();
                    nowTime.setUTCMilliseconds(0);
                    const offset = userTime.getTime() - nowTime.getTime();
                    if (offset < 46800000) { // If the offset is more than 13 hours then something has gone wrong
                        timezoneOffset = offset;
                        browser.runtime.sendMessage(userSettingsRefreshedArguments).catch(handleMessageError);
                    } else {
                        handleError(new Error('User timezone offset is more than 13 hours.'));
                    }
                }).catch((error) => {
                    handleError(error);
                });
            } else {
                browser.runtime.sendMessage(userSettingsRefreshedArguments).catch(handleMessageError);
            }
        }).catch((error) => {
            handleError(error);
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
        case "userReady":
            sendResponse(milk.isUserReady(debugMode));
            break;
        case "authorise":
            authorise();
            break;
        case "addTask":
            addTask(message.name, message.link, message.dueDate, message.useSelection, message.selection, message.listId);
            break;
        case "userSettings":
            sendResponse({settings: userSettings, timezoneOffset});
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
