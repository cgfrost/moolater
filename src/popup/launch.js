/* global tabs:false, window:false, browser:false chrome:false*/

(function () {
    'use strict';

    window.browser = (function () {
        return window.browser ||
               window.chrome;
    })();

    let validationRegex = new RegExp('^https?://');
    let activeTimeout = undefined;

    // Sections
    let loginSection = document.getElementById('login');
    let addTaskSection = document.getElementById('content');
    let statusSection = document.getElementById('status');

    // Buttons
    let loginSubmitButton = document.getElementById('login-submit');
    let loginResetButton = document.getElementById('login-reset');
    let domainRefreshButton = document.getElementById('domain-refresh');
    let domainRefreshButtonImg = listRefreshButton.firstElementChild;
    let applicationRefreshButton = document.getElementById('application-refresh');
    let applicationRefreshButtonImg = listRefreshButton.firstElementChild;
    let existingModelRefreshButton = document.getElementById('existing-model-refresh');
    let existingModelRefreshButtonImg = listRefreshButton.firstElementChild;
    let optionsButton = document.getElementById('options');

    // Status
    let statusMsg = document.getElementById('status-msg');
    let statusImg = document.getElementById('status-img');

    // Add Task Form Elements
    let domainElement = document.getElementById('domain');
    let domainLabel = document.getElementById('domain-label');
    let applicationElement = document.getElementById('link');
    let applicationLabel = document.getElementById('link-label');
    let existingModelElement = document.getElementById('existing-model');
    let existingModelLabel = document.getElementById('existing-model-label');
    let modelNameElement = document.getElementById('model-name');
    let modelNameLabel = document.getElementById('model-name-label');
    let filterElement = document.getElementById('filter');
    let filterLabel = document.getElementById('filter-label');

    function handleFatalError(error, altAction) {
        let errorMessage = error.message ? error.message : error.toString();
        console.warn(`Moo Later fatal error: ${errorMessage}`);
        showMessageThen(`Failed: ${errorMessage}`, 'error', altAction);
    }

    function log(message, debugMode) {
        if (debugMode) {
            console.log(message);
        }
    }

	// Initialization
	document.addEventListener('DOMContentLoaded', () => {

        taskElement.addEventListener('keyup', (event) => {
        	if (event.keyCode === 13) {
        		linkElement.focus();
        	}
        }, false);

        linkElement.addEventListener('keyup', (event) => {
        	if (event.keyCode === 13) {
                addTaskSubmitButton.focus();
        	}
        }, false);

        addListElement.addEventListener('keyup', (event) => {
            if (event.keyCode === 13) {
                addListSubmitButton.focus();
            }
        }, false);

        optionsButton.addEventListener('click', () => {
            browser.runtime.openOptionsPage().then(() => {
                closeMe();
            });
        }, false);

        browser.runtime.sendMessage({action: "userReady"}).then((response) => {
            if (response){
                showAddRecording();
            } else {
                showSection(loginSection);
            }
        }).catch(handleFatalError);

		addListSubmitButton.addEventListener('click', () => {
            if (addListElement.value !== '') {
                setIconState(addListStatusImg, 'loading');
                setTextElement(addListLabel, 'New List:');
                addListSubmitButton.disabled = true;
                addListCancelButton.disabled = true;
                let addListArguments = {
                    action: 'addList',
                    listName: addListElement.value
                };
                browser.runtime.sendMessage(addListArguments).then(() => {
                    setTimeout(() => {
                        showSection(addTaskSection);
                    }, 500);
                }).catch((error) => {
                    handleFatalError(error, showAddRecording);
                });
            } else {
                setTextElement(addListLabel, 'New List: List name can\'t be empty.');
            }
		}, false);

		addListCancelButton.addEventListener('click', () => {
			showSection(addTaskSection);
		}, false);

        addTaskSubmitButton.addEventListener('click', () => {
            let formValid = true;
            if (taskElement.value !== '') {
                setTextElement(taskLabel, 'Task name:');
            } else {
                setTextElement(taskLabel, 'Task: Task name can\'t be empty.');
                formValid = false;
            }
            if (linkElement.value === '' || validationRegex.test(linkElement.value)) {
                setTextElement(linkLabel, 'Link:');
            } else {
                setTextElement(linkLabel, 'Link: Links must start with \'http://\' or \'https://\'.');
                formValid = false;
            }
            if (formValid) {
                showMessage('Sending the task to RTM', 'loading');
                activeTimeout = setTimeout(() => {
                    showMessage('Still sending the task to RTM...', 'loading');
                }, 3000);
                let addTaskArguments = {
                    action: 'addTask',
                    name: taskElement.value,
                    link: linkElement.value,
                    useSelection: selectedElement.checked,
                    selection: selectedElement.value,
                    listId: listsElement.value
                };
                browser.runtime.sendMessage(addTaskArguments).catch(handleFatalError);
            }
		}, false);

		permissionSubmitButton.addEventListener('click', () => {
            showMessage('Requesting permission', 'loading');
            browser.runtime.sendMessage({action: "authorise"}).catch(handleFatalError);
		}, false);

		listRefreshButton.addEventListener('click', () => {
            setIconState(listRefreshButtonImg, 'loading');
            browser.runtime.sendMessage({action: "refreshLists"}).catch(() => {
                setIconState(listRefreshButtonImg, 'error');
                setTimeout(() => {
                    setIconState(listRefreshButtonImg, 'refresh');
                }, 1000);
            });
		}, false);

		listPlusButton.addEventListener('click', () => {
            setTextElement(addListLabel, 'New List:');
            setIconState(addListStatusImg, 'blank');
            addListSubmitButton.disabled = false;
            addListCancelButton.disabled = false;
            addListElement.value = '';
			showSection(addListSection);
		}, false);

	});

    function handleMessage(message, sender) {
        log(`Message received in the popup script: ${message.action} - ${sender.id}`, message.debug);
        switch(message.action) {
            case "listsRefreshed":
                browser.storage.local.get('defaultList').then((setting) => {
                    updateLists(message.lists, setting.defaultList, message.debug);
                    setIconState(listRefreshButtonImg, 'done');
                    setTimeout(() => {
                        setIconState(listRefreshButtonImg, 'refresh');
                    }, 1000);
                }).catch(handleFatalError);
                break;
            case "listsRefreshedError":
                browser.storage.local.get('defaultList').then((setting) => {
                    updateLists(message.lists, setting.defaultList, message.debug);
                    setIconState(listRefreshButtonImg, 'error');
                    setTimeout(() => {
                        setIconState(listRefreshButtonImg, 'refresh');
                    }, 1000);
                }).catch(handleFatalError);
                break;
            case "taskAdded":
                showMessageThen('Task added', 'done');
                break;
            case "taskAddedError":
                showMessageThen(`Error: ${message.reason}`, 'error');
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
                closeMe()
            }
        }, 1000);
    };

    let closeMe = () => {
        browser.tabs.getCurrent().then((myTab) => {
            browser.tabs.remove(myTab.id).catch((error) => {
                console.warn(`Skipjaq closing error: ${error.message}`);
            });
        });
    };

	let showMessage = (message, icon) => {
	    if (activeTimeout) {
            clearTimeout(activeTimeout);
            activeTimeout = undefined;
        }
		setTextElement(statusMsg, message);
		setIconState(statusImg, icon);
		showSection(statusSection);
	};

	let showSection = (element) => {
		let sections = document.getElementsByClassName("section");
		for (let section of sections) {
			section.classList.add('hide');
		}
		element.classList.remove('hide');
	};

	let setIconState = (icon, iconName) => {
		icon.setAttribute('src', '../images/' + iconName + '.svg');
	};

	let setTextElement = (label, text) => {
		let firstTextElement;
		let children = label.childNodes;
		for (let child of children) {
			if (child.nodeName === '#text') {
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

    let showAddRecording = () => {
        browser.storage.local.get().then((settings) => {
            browser.runtime.sendMessage({action: "lists"}).then((lists) => {
                if(isMobile) {
                    browser.tabs.query({active: true}).then((activeTabs) => {
                        prePopulateAddTask(settings, activeTabs, lists);
                    });
                } else {
                    browser.windows.getCurrent({populate: true, windowTypes: ['normal']}).then((currentWindow) => {
                        prePopulateAddTask(settings, currentWindow.tabs, lists);
                    });
                }
            });
        }).catch(handleFatalError);
    };

    let prePopulateAddTask = (settings, tabs, lists) => {
        let activeTab = getActiveTab(tabs);
        let link =  activeTab.url;
        if (link.startsWith('about:')) {
            populateAddTask(settings, '', activeTab, undefined);
        } else {
            browser.tabs.executeScript(activeTab.id, {code: desktopSelectionCode}).then((selection) => {
                populateAddTask(settings, link, activeTab, `${selection}`);
            }, (error) => {
                populateAddTask(settings, link, activeTab, undefined);
                console.log(`Got selected text error '${error}'`);
            });
        }
        updateLists(lists, settings.defaultList);
        showSection(addTaskSection);
    };

    let getActiveTab = (tabs) => {
        if (tabs.length === 0) {
            handleFatalError('No open tab found.');
        }
        if (tabs.length === 1) {
            return tabs[0];
        }
        let tabToSend = tabs[0];
        for (let i = 1; i < tabs.length; i++) {
            if (tabs[i].active && tabs[i].lastAccessed >= tabToSend.lastAccessed) {
                tabToSend = tabs[i];
            }
        }
        return tabToSend;
    };

    let populateAddTask = (settings, link, activeTab, selectedText) => {
        setTextElement(taskLabel, 'Task name:');
        setTextElement(linkLabel, 'Link:');
        taskElement.value = settings.useTitle === true ? activeTab.title : '';
        linkElement.value = settings.useLink === true ? link : '';
        taskElement.focus();
        if (selectedText && selectedText.length > 0) {
            selectedElement.checked = true;
            selectedElement.value = selectedText;
            selectedLabel.classList.remove('hide');
        } else {
            selectedLabel.classList.add('hide');
        }
    };

    let updateLists = (lists, defaultList, debug) => {
        log(`Updating the lists, default: ${defaultList}`, debug);
        while (listsElement.firstChild) {
            listsElement.removeChild(listsElement.firstChild);
        }
        let defaultFound = false;
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].smart === '0') {
                let selected = defaultList === lists[i].name;
                if (selected) {
                    defaultFound = true;
                }
                let newOption = createOptionElement(lists[i].id, lists[i].name, selected);
                listsElement.appendChild(newOption);
            }
        }
        if (!defaultFound) {
            listsElement.selectedIndex = "0";
        }
    };

    let createOptionElement = (id, name, selected) => {
        let option = document.createElement('option');
        option.value = id;
        let label = document.createTextNode(name);
        option.appendChild(label);
        if (selected) {
            option.setAttribute('selected', 'selected');
        }
        return option;
    };

    browser.runtime.onMessage.addListener(handleMessage);

}());

