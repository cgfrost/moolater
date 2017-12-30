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

            if (milk.isUserReady()) {
                refreshLists();
            }

            browser.storage.local.set(validSettings).then(() => {
                console.log(`Storage initialized, frob: ${validSettings.frob} token: ${validSettings.token}`);
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
                    milk.fetchToken();
                    browser.windows.onRemoved.removeListener(windowListener);
                }
            };
            browser.windows.onRemoved.addListener(windowListener);
        }).catch(handleError);
    }

    function addTask(name, link, useSelection, selection, listId) {
        console.log(`Adding task: ${name}, ${link}, ${useSelection}, ${selection}, ${listId}`);
    }

    function refreshLists() {
        milkAction.getLists(milk).then((resp) => {
            lists = resp.rsp.lists.list;

            // Send a message to the popup.
        });
    }

    function addList(listName) {
        console.log(`Adding list: ${listName}`);
    }

    function handleMessage(message, sender, sendResponse) {
        console.log(`Message from the popup script: ${message}`);
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
                refreshLists();
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