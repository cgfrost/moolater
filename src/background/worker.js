/* global browser: false */

(function () {
    'use strict';

    let data = '{"a": "bf427f2504b074dc361c18d255354649", "b": "9d98f15fda6ba725"}';
    let milk = new Milk(JSON.parse(data), 'write');

    function handleMessage(request, sender, sendResponse) {

        console.log(`Message from the popup script: ${request}`);
        switch(request) {
            case "userReady":
                sendResponse(milk.isUserReady());
                break;
            case "authUrl":
                sendResponse("http://api.");
                break;
            default:
                console.log(`Unrecognised message with query "${request}"`);
        }
    }

    browser.runtime.onMessage.addListener(handleMessage);

}());