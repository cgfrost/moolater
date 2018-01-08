/* global tabs:false, window:false, browser:false */

(function () {
    'use strict';

    const ANDROID = 'android';
    let validationRegex = new RegExp('^https?://');
    let activeTimeout = undefined;

    // Sections
    let addTaskSection = document.getElementById('content');
    let addListSection = document.getElementById('add-list');
    let loginSection = document.getElementById('login');
    let statusSection = document.getElementById('status');

    // Buttons
    let addListSubmitButton = document.getElementById('add-list-submit');
    let addListCancelButton = document.getElementById('add-list-cancel');
    let addTaskSubmitButton = document.getElementById('add-task-submit');
    let permissionSubmitButton = document.getElementById('permissions-submit');
    let listRefreshButton = document.getElementById('lists-refresh');
    let listPlusButton = document.getElementById('lists-plus');
    let optionsButton = document.getElementById('options');

    // Status
    let statusMsg = document.getElementById('status-msg');
    let statusImg = document.getElementById('status-img');

    // Add Task Form Elements
    let taskElement = document.getElementById('task');
    let taskLabel = document.getElementById('task-label');
    let linkElement = document.getElementById('link');
    let linkLabel = document.getElementById('link-label');
    let listsElement = document.getElementById('lists');
    let selectedElement = document.getElementById('selected-text');
    let selectedLabel = document.getElementById('selected-text-label');

    // Add List Form Elements
    let addListElement = document.getElementById('list');
    let addListLabel = document.getElementById('list-label');
    let addListStatus = document.getElementById('add-list-status');

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

        browser.runtime.getPlatformInfo().then((info) => {
            if(ANDROID === info.os) {
                document.body.style.fontSize = '2.3em';
                document.body.style.width = '100%';
                let icons = document.querySelectorAll("button.icon img");
                for (let i = 0; i < icons.length; i++) {
                    icons[i].style.width = '4em';
                    icons[i].style.height = '4em';
                }
            }
        });

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
                window.close();
            });
        }, false);

        browser.runtime.sendMessage({action: "userReady"}).then((response) => {
            if (response){
                showAddTask();
            } else {
                showSection(loginSection);
            }
        }).catch(handleFatalError);

		addListSubmitButton.addEventListener('click', () => {
            if (addListElement.value !== '') {
                setIconState(addListStatus.firstElementChild, 'loading');
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
                    handleFatalError(error, showAddTask);
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
            setIconState(listRefreshButton.firstElementChild, 'loading');
            browser.runtime.sendMessage({action: "refreshLists"}).catch(() => {
                setIconState(listRefreshButton.firstElementChild, 'error');
                setTimeout(() => {
                    setIconState(listRefreshButton.firstElementChild, 'refresh');
                }, 1000);
            });
		}, false);

		listPlusButton.addEventListener('click', () => {
            setTextElement(addListLabel, 'New List:');
            setIconState(addListStatus.firstElementChild, 'blank');
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
                    setIconState(listRefreshButton.firstElementChild, 'done');
                    setTimeout(() => {
                        setIconState(listRefreshButton.firstElementChild, 'refresh');
                    }, 1000);
                }).catch(handleFatalError);
                break;
            case "listsRefreshedError":
                browser.storage.local.get('defaultList').then((setting) => {
                    updateLists(message.lists, setting.defaultList, message.debug);
                    setIconState(listRefreshButton.firstElementChild, 'error');
                    setTimeout(() => {
                        setIconState(listRefreshButton.firstElementChild, 'refresh');
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
                window.close();
            }
        }, 1000);
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

    let showAddTask = () => {
        browser.storage.local.get().then((settings) => {
            browser.tabs.query({active: true}).then((activeTabs) => {
                browser.runtime.sendMessage({action: "lists"}).then((lists) => {
                    document.getElementById('title').textContent = `Tabs: ${activeTabs.length} Lists: ${lists.length}`;
                    let link =  activeTabs[0].url;
                    if (link.startsWith('about:')) {
                        populateAddTask(settings, '', activeTabs[0], undefined);
                    } else {
                        let code = 'window.getSelection().toString()';
                        browser.tabs.executeScript(activeTabs[0].id, {code: code}).then((selection) => {
                            populateAddTask(settings, link, activeTabs[0], `${selection}`);
                        }, (error) => {
                            populateAddTask(settings, link, activeTabs[0], undefined);
                            console.log(`Got selected text error '${error}'`);
                        });
                    }
                    updateLists(lists, settings.defaultList);
                    showSection(addTaskSection);
                });
            });
        }).catch(handleFatalError);
    };

    let populateAddTask = (settings, link, activeTab, selectedText) => {
        setTextElement(taskLabel, 'Task name:');
        setTextElement(linkLabel, 'Link:');
        taskElement.value = settings.useTitle ? activeTab.title : '';
        linkElement.value = settings.useLink ? link : '';
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

