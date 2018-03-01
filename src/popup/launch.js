
(function () {
    "use strict";

    // Shim for both Chrome and Firefox support.
    window.browser = (function () {
        return window.browser || window.chrome;
    })();

    // let validationRegex = new RegExp('^https?://');

    // Sections
    let loginSection = document.getElementById("login");
    let recordingSection = document.getElementById("recorder");
    let statusSection = document.getElementById("status");

    // Buttons
    let loginSubmitButton = document.getElementById("login-submit");
    let domainRefreshButton = document.getElementById("domain-refresh");
    let domainRefreshButtonImg = domainRefreshButton.firstElementChild;
    let applicationRefreshButton = document.getElementById("application-refresh");
    let applicationRefreshButtonImg = applicationRefreshButton.firstElementChild;
    let recordButton = document.getElementById("record");
    let optionsButton = document.getElementById("options");

    // Status
    let statusMsg = document.getElementById("status-msg");
    let statusImg = document.getElementById("status-img");

    // Login Form Elements
    // let logindIdLabel = document.getElementById('login-id-label');
    let loginIdElement = document.getElementById("login-id");
    // let loginPasswordLabel = document.getElementById('login-password-label');
    let loginPasswordElement = document.getElementById("login-password");

    // Add Task Form Elements
    // let domainLabel = document.getElementById("domain-label");
    let domainElement = document.getElementById("domain");
    // let applicationLabel = document.getElementById("application-label");
    let applicationElement = document.getElementById("application");
    // let modelNameLabel = document.getElementById("model-name-label");
    let modelNameElement = document.getElementById("model-name");
    // let filterLabel = document.getElementById("filter-label");
    let filterElement = document.getElementById("filter");

    function handleFatalError(error, altAction) {
        let errorMessage = error.message ? error.message : error.toString();
        console.warn(`Skipjaq fatal error: ${errorMessage}`);
        showMessageThen(`Failed: ${errorMessage}`, "error", altAction);
    }

    function log(message, debugMode) {
        if (debugMode) {
            console.log(message);
        }
    }

    // Initialization
    document.addEventListener("DOMContentLoaded", () => {

        // Register keyboard helpers for pro users
        loginIdElement.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                filterElement.focus();
            }
        }, false);

        loginPasswordElement.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                loginSubmitButton.focus();
            }
        }, false);

        modelNameElement.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                filterElement.focus();
            }
        }, false);

        filterElement.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                recordButton.focus();
            }
        }, false);

        // Register event listeners
        optionsButton.addEventListener("click", () => {
            browser.runtime.openOptionsPage().then(() => {
                closeMe();
            });
        }, false);

        loginSubmitButton.addEventListener("click", () => {
            showMessage("Authorising", "loading");
            browser.runtime.sendMessage({action: "login",
                id: loginIdElement.value,
                password: loginPasswordElement.value})
                .catch(handleFatalError);
        }, false);

        domainRefreshButton.addEventListener("click", () => {
            setIconState(domainRefreshButtonImg, "loading");
            browser.runtime.sendMessage({action: "refreshDomains"}).catch(() => {
                setIconState(domainRefreshButtonImg, "error");
                setTimeout(() => {
                    setIconState(domainRefreshButtonImg, "refresh");
                }, 1000);
            });
        }, false);

        applicationRefreshButton.addEventListener("click", () => {
            setIconState(applicationRefreshButtonImg, "loading");
            browser.runtime.sendMessage({action: "refreshApplications"}).catch(() => {
                setIconState(applicationRefreshButtonImg, "error");
                setTimeout(() => {
                    setIconState(applicationRefreshButtonImg, "refresh");
                }, 1000);
            });
        }, false);

        recordButton.addEventListener("click", () => {
            if (recordButton.value === "start") {
                recordButton.value = "stop";
                recordButton.innerHTML = "Stop Recording";
                browser.runtime.sendMessage({action: "startRecording",
                    id: loginIdElement.value,
                    password: loginPasswordElement.value})
                    .catch(handleFatalError);
            } else {
                recordButton.value = "start";
                recordButton.innerHTML = "Start Recording";
                browser.runtime.sendMessage({action: "stopRecording",
                    id: loginIdElement.value,
                    password: loginPasswordElement.value})
                    .catch(handleFatalError);
            }
        }, false);

        // Display the correct section of the UI

        browser.runtime.sendMessage({action: "userReady"}).then((response) => {
            if (response.userReady){
                showAddRecording(response.domains);
            } else {
                showLogin();
            }
        }).catch(handleFatalError);

    });

    function handleMessage(message, sender) {
        log(`Message received in the popup script: ${message.action} - ${sender.id}`, message.debug);
        switch(message.action) {
        case "login":
            showAddRecording(message.domains);
            break;
        case "loginError":
            showMessageThen(`Error: ${message.reason}`, "error", showLogin);
            break;
        case "domainsRefreshed":
            updateList(domainElement, message.domains, message.debug);
            setIconState(domainRefreshButtonImg, "done");
            setTimeout(() => {
                setIconState(domainRefreshButtonImg, "refresh");
            }, 1000);
            break;
        case "domainsRefreshedError":
            updateList(domainElement, message.domains, message.debug);
            setIconState(domainRefreshButtonImg, "error");
            setTimeout(() => {
                setIconState(domainRefreshButtonImg, "refresh");
            }, 1000);
            break;
        case "applicationsRefreshed":
            updateList(applicationElement, message.domains, message.debug);
            setIconState(applicationRefreshButtonImg, "done");
            setTimeout(() => {
                setIconState(applicationRefreshButtonImg, "refresh");
            }, 1000);
            break;
        case "applicationsRefreshedError":
            updateList(applicationElement, message.domains, message.debug);
            setIconState(applicationRefreshButtonImg, "error");
            setTimeout(() => {
                setIconState(applicationRefreshButtonImg, "refresh");
            }, 1000);
            break;
        case "recordingAdded":
            showMessageThen("Recording sent to Skipjaq", "done");
            break;
        case "recordingError":
            showMessageThen(`Error: ${message.reason}`, "error");
            break;
        default:
            console.log(`Unrecognised message with query "${message.action}"`);
        }
    }

    let showMessageThen = (message, icon, then) => {
        showMessage(message, icon);
        setTimeout(() => {
            if (then) {
                then();
            } else {
                closeMe();
            }
        }, 1000);
    };

    let closeMe = () => {
        browser.tabs.getCurrent().then((myTab) => {
            if (myTab) {
                browser.tabs.remove(myTab.id).catch((error) => {
                    console.warn(`Skipjaq closing error: ${error.message}`);
                });
            } else {
                console.warn(`Skipjaq closing error, current tab not found: ${myTab}`);
            }
        });
    };

    let showMessage = (message, icon) => {
        setTextElement(statusMsg, message);
        setIconState(statusImg, icon);
        showSection(statusSection);
    };

    let showSection = (element) => {
        let sections = document.getElementsByClassName("section");
        for (let section of sections) {
            section.classList.add("hide");
        }
        element.classList.remove("hide");
    };

    let setIconState = (icon, iconName) => {
        icon.setAttribute("src", "../images/" + iconName + ".svg");
    };

    let setTextElement = (label, text) => {
        let firstTextElement;
        let children = label.childNodes;
        for (let child of children) {
            if (child.nodeName === "#text") {
                firstTextElement = child;
                break;
            }
        }
        if (firstTextElement) {
            label.replaceChild(document.createTextNode(text), firstTextElement);
        } else {
            label.appendChild(document.createTextNode(text));
        }
    };

    let showLogin = () => {
        showSection(loginSection);
    };

    let showAddRecording = (domains, debug) => {
        updateList(domainElement, domains, debug);
        showSection(recordingSection);
        // browser.storage.local.get().then((settings) => {
        //     browser.runtime.sendMessage({action: "lists"}).then((lists) => {
        //         browser.windows.getCurrent({populate: true, windowTypes: ["normal"]}).then((currentWindow) => {
        //             prePopulateRecording(settings, currentWindow.tabs, lists);
        //         });
        //     });
        // }).catch(handleFatalError);
    };

    // let prePopulateRecording = (settings, tabs, lists) => {
    //     let activeTab = getActiveTab(tabs);
    //     let link =  activeTab.url;
    //     if (link.startsWith("about:")) {
    //         populateAddTask(settings, "", activeTab, undefined);
    //     } else {
    //         browser.tabs.executeScript(activeTab.id, {code: desktopSelectionCode}).then((selection) => {
    //             populateAddTask(settings, link, activeTab, `${selection}`);
    //         }, (error) => {
    //             populateAddTask(settings, link, activeTab, undefined);
    //             console.log(`Got selected text error '${error}'`);
    //         });
    //     }
    //     updateLists(lists, settings.defaultList);
    //     showSection(recordingSection);
    // };
    //
    // let getActiveTab = (tabs) => {
    //     if (tabs.length === 0) {
    //         handleFatalError("No open tab found.");
    //     }
    //     if (tabs.length === 1) {
    //         return tabs[0];
    //     }
    //     let tabToSend = tabs[0];
    //     for (let i = 1; i < tabs.length; i++) {
    //         if (tabs[i].active && tabs[i].lastAccessed >= tabToSend.lastAccessed) {
    //             tabToSend = tabs[i];
    //         }
    //     }
    //     return tabToSend;
    // };

    // let populateAddTask = (settings, link, activeTab, selectedText) => {
    //     setTextElement(taskLabel, "Task name:");
    //     setTextElement(linkLabel, "Link:");
    //     taskElement.value = settings.useTitle === true ? activeTab.title : "";
    //     linkElement.value = settings.useLink === true ? link : "";
    //     taskElement.focus();
    //     if (selectedText && selectedText.length > 0) {
    //         selectedElement.checked = true;
    //         selectedElement.value = selectedText;
    //         selectedLabel.classList.remove("hide");
    //     } else {
    //         selectedLabel.classList.add("hide");
    //     }
    // };
    //
    let updateList = (listElement, values, debug) => {
        log(`Updating the values of: ${listElement}`, debug);
        while (listElement.firstChild) {
            listElement.removeChild(listElement.firstChild);
        }
        for (let i = 0; i < values.length; i++) {
            let newOption = createOptionElement(values[i].uuid, values[i].name, false);
            listElement.appendChild(newOption);
        }
        listElement.selectedIndex = "0";
    };

    let createOptionElement = (id, name, selected) => {
        let option = document.createElement("option");
        option.value = id;
        let label = document.createTextNode(name);
        option.appendChild(label);
        if (selected) {
            option.setAttribute("selected", "selected");
        }
        return option;
    };

    browser.runtime.onMessage.addListener(handleMessage);

}());

