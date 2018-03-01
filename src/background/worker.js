/* global Skipjaq:false, SkipjaqAction:false */

(function () {
    "use strict";

    console.log("============================= SKIPJAQ =============================");

    window.browser = (function () {
        return window.browser || window.chrome;
    })();

    let skipjaq;
    let skipjaqAction = new SkipjaqAction();
    let domains = [];
    // let applications = [];
    let debugMode = false;

    function handleError(error) {
        let errorMessage = error.message ? error.message : error.toString();
        console.warn(`Skipjaq, background error: ${errorMessage}`);
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

            // let booleanOption = (option) => {
            //     return option === undefined ? true : option === true;
            // };

            let validSettings = {
                defaultList: settings.defaultList || "Read Later",
                token: settings.token || "INVALID"
            };

            skipjaq = new Skipjaq(validSettings.token, debugMode);

            if (skipjaq.isUserReady(debugMode)) {
                refreshDomains();
            }

            browser.storage.local.set(validSettings).then(() => {
                browser.storage.onChanged.addListener((changes, area) => {
                    log(`Setting have been changed: ${area} - ${changes}`);
                    // if (area === 'local' && changes.showContextMenu && changes.showContextMenu.oldValue !== changes.showContextMenu.newValue) {
                    //     if (changes.showContextMenu.newValue) {
                    //         addContextMenu();
                    //     } else {
                    //         removeContextMenu();
                    //     }
                    // }
                });

                log("Storage initialized");
            });
        }).catch(handleError);
    }

    // Actions

    function authorise(user, password) {
        log(`Logging in with id ${user}`);
        skipjaqAction.getToken(skipjaq, debugMode, user, password).then((resp) => {
            domains = resp.availableDomains; // each domain is an object with name and uuid properties.
            skipjaq.setToken(resp.authToken);
            browser.runtime.sendMessage({action: "login", debug: debugMode, domains: domains}).catch(handleMessageError);
        }).catch((error) => {
            browser.runtime.sendMessage({action: "loginError", debug: debugMode, reason: error.message}).catch(handleMessageError);
        });
    }

    function startRecording(filter, name) {
        log(`Start recording: ${filter}, ${name}`);
        // skipjaqAction.addTask(milk, debugMode, name, listId).then((resp) => {
        //     let list = resp.rsp.list;
        //     let addLinkPromise = link === '' ? true : skipjaqAction.addUrlToTask(milk, debugMode, list, link);
        //     let addNotePromise = useSelection ? skipjaqAction.addNoteToTask(milk, debugMode, list, 'Selected text from the webpage:', selection) : true;
        //     Promise.all([addLinkPromise, addNotePromise]).then(() => {
        //         browser.runtime.sendMessage({action: 'taskAdded', debug: debugMode}).catch(handleMessageError);
        //     }).catch((error) => {
        //         browser.runtime.sendMessage({action: 'taskAddedError', debug: debugMode, reason: error.message}).catch(handleMessageError);
        //     });
        // }).catch((error) => {
        //     browser.runtime.sendMessage({action: 'taskAddedError', debug: debugMode, reason: error.message}).catch(handleMessageError);
        // });
    }

    function stopRecording() {
        log("Stop recording");
        // skipjaqAction.addList(milk, debugMode, listName).then((resp) => {
        //     lists.push(resp.rsp.list);
        //     let listsRefreshedArguments = {
        //         action: 'listsRefreshed',
        //         debug: debugMode,
        //         lists: lists
        //     };
        //     browser.runtime.sendMessage(listsRefreshedArguments).catch(handleMessageError);
        // }).catch((error) => {
        //     let listsRefreshedArguments = {
        //         action: 'listsRefreshedError',
        //         debug: debugMode,
        //         lists: lists,
        //         reason: error
        //     };
        //     browser.runtime.sendMessage(listsRefreshedArguments).catch(handleMessageError);
        // });
    }

    function refreshDomains() {
        log("Refresh domains");
        // skipjaqAction.getLists(milk, debugMode).then((resp) => {
        //     domains = resp.rsp.lists.list;
        //     let listsRefreshedArguments = {
        //         action: 'listsRefreshed',
        //         debug: debugMode,
        //         lists: lists
        //     };
        //     browser.runtime.sendMessage(listsRefreshedArguments).catch(handleMessageError);
        // }).catch((error) => {
        //     let listsRefreshedArguments = {
        //         action: 'listsRefreshedError',
        //         debug: debugMode,
        //         lists: lists,
        //         reason: error.message
        //     };
        //     browser.runtime.sendMessage(listsRefreshedArguments).catch(handleMessageError);
        // });
    }

    function refreshApplications() {
        log("Refresh applications");

    }

    // Message handler

    function handleMessage(message, sender, sendResponse) {
        log(`Message received in the background script: ${message.action} - ${sender.id}`);
        switch (message.action) {
        case "userReady":
            sendResponse({"userReady": skipjaq.isUserReady(debugMode), "domains": domains});
            break;
        case "login":
            authorise(message.id, message.password);
            break;
        case "refreshDomains":
            refreshDomains(debugMode);
            break;
        case "refreshApplications":
            refreshApplications(debugMode);
            break;
        case "startRecording":
            startRecording(message.filter, message.modelName);
            break;
        case "stopRecording":
            stopRecording();
            break;
        default:
            handleError(`Unrecognised message with query "${message.action}"`);
        }
    }

    browser.runtime.onInstalled.addListener((details) => {
        debugMode = details.temporary;
        log(`Temporary installation: ${details.temporary}`);
    });
    initOptions();
    browser.runtime.onMessage.addListener(handleMessage);

}());
