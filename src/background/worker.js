/* global browser: false */

(function () {
    'use strict';

    let milk = undefined;
    let milkAction = new MilkAction();
    let lists = [];

    function handleError(error) {
        console.log(`Error: ${error}`);
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
            milk = new Milk(JSON.parse(data), 'write', validSettings.frob, validSettings.token);

            console.log(`User auth: frob=${validSettings.frob} token=${validSettings.token}`);
            if (milk.isUserReady()) {
                refreshLists(false);
            }

            browser.storage.local.set(validSettings).then(() => {
                console.log(`Storage initialized`);
            }, handleError);
        }, handleError);
    }

    function authorise() {
        let authUrl = milk.getAuthUrl();
        browser.windows.create({url: authUrl, type: 'panel'}).then((newWindow) => {
            console.log(`Created new window "${newWindow.id}" at ${authUrl}`);
            let windowListener = (windowId) => {
                console.log(`Window remove event for id ${windowId}`);
                if (windowId === newWindow.id) {
                    milk.fetchToken(() => {
                        if (milk.isUserReady()) {
                            refreshLists(false);
                        }                    });
                    browser.windows.onRemoved.removeListener(windowListener);
                }
            };
            browser.windows.onRemoved.addListener(windowListener);
        }).catch(handleError);
    }

    function addTask(name, link, useSelection, selection, listId) {
        console.log(`Adding task: ${name}, ${link}, ${useSelection}, ${selection}, ${listId}`);
    }

    function refreshLists(updatePopup) {
        milkAction.getLists(milk).then((resp) => {
            lists = resp.rsp.lists.list;
            let listsRefreshedArguments = {
                action: 'listsRefreshed',
                lists: lists
            };
            if (updatePopup) {
                browser.runtime.sendMessage(listsRefreshedArguments);
            }
        }).catch((error) => {
            let listsRefreshedArguments = {
                action: 'listsRefreshedError',
                lists: lists,
                error: error
            };
            if (updatePopup) {
                browser.runtime.sendMessage(listsRefreshedArguments);
            }
        });

    }

    function addList(listName) {
        console.log(`Adding list: ${listName}`);
    }

    function handleMessage(message, sender, sendResponse) {
        console.log(`Message received in the background script: ${message.action} - ${sender.id}`);
        switch(message.action) {
            case "userReady":
                sendResponse(milk.isUserReady());
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
                refreshLists(true);
                break;
            case "addList":
                addList(message.listName);
                break;
            default:
                console.log(`Unrecognised message with query "${request}"`);
        }
    }

    initOptions();
    browser.runtime.onMessage.addListener(handleMessage);

}());