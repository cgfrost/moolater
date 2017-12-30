/* global browser: false */

(function () {
    'use strict';

    let data = '{"a": "bf427f2504b074dc361c18d255354649", "b": "9d98f15fda6ba725"}';
    let milk = new Milk(JSON.parse(data), 'write');

    function handleError(error) {
        console.log(`Error: ${error}`);
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
        }, handleError);
    }

    function handleMessage(request, sender, sendResponse) {
        console.log(`Message from the popup script: ${request}`);
        switch(request) {
            case "userReady":
                sendResponse(milk.isUserReady());
                break;
            case "authorise":
                authorise();
                break;
            default:
                console.log(`Unrecognised message with query "${request}"`);
        }
    }

    browser.runtime.onMessage.addListener(handleMessage);

}());