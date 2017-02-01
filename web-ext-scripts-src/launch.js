/* global addon:false, document:false, window:false */

import Milk from './auth/Milk.js';
'use strict';

	//Sections
	var addTaskSection = document.getElementById('content');
	var addListSection = document.getElementById('add-list');
	var loginSection = document.getElementById('login');
	var statusSection = document.getElementById('status');

	//Buttons
	var addListSubmitButton = document.getElementById('add-list-submit');
	var addListCancelButton = document.getElementById('add-list-cancel');
	var addTaskSubmitButton = document.getElementById('add-task-submit');
	var permissionSubmitButton = document.getElementById('permissions-submit');
	var listRefreshButton = document.getElementById('lists-refresh');
	var listPlusButton = document.getElementById('lists-plus');

	//Status
	var statusImg = document.getElementById('status-img');
	var statusMsg = document.getElementById('status-msg');



	// var taskElement = document.getElementById('task');
	// var taskLabel = document.getElementById('task-label');
	// var linkElement = document.getElementById('link');
	// var linkLabel = document.getElementById('link-label');
	// var listsElement = document.getElementById('lists');
	//
	// var selectedElement = document.getElementById('selected-text');
	// var selectedLabel = document.getElementById('selected-text-label');
	//
	//
	// var addlistElement = document.getElementById('list');
	// var addlistLabel = document.getElementById('list-label');
	// var addlistStatus = document.getElementById('add-list-status');


	var validationRegex = new RegExp('^https?://');


  let data = '{"a": "bf427f2504b074dc361c18d255354649", "b": "9d98f15fda6ba725"}';
  let milk = new Milk(JSON.parse(data), 'write');

	// Initialization
	document.addEventListener('DOMContentLoaded', (event) => {
		if(milk.isUserReady()){
			showSection(addTaskSection);
		} else {
			showSection(loginSection);
		}

		addListSubmitButton.addEventListener('click', () => {
		}, false);

		addListCancelButton.addEventListener('click', () => {
			showSection(addTaskSection);
		}, false);

		addTaskSubmitButton.addEventListener('click', () => {
		}, false);

		permissionSubmitButton.addEventListener('click', () => {
			doLogin();
		}, false);

		listRefreshButton.addEventListener('click', () => {
		}, false);

		listPlusButton.addEventListener('click', () => {
			showSection(addListSection);
		}, false);
	});

	let showMessage = (message, icon) => {
		setTextElement(statusMsg, message);
		setIconState(statusImg, icon);
		showSection(statusSection);
	};


	let showSection = (element) => {
		var sections = document.getElementsByClassName("section");
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

	let doLogin = () => {
		showMessage('Requesting permission', 'loading');
		browser.windows.create({
			url: milk.getAuthUrl(),
			type: 'panel'
		}).then(
			(newWindow) => {
				console.log(`Created new window ${newWindow.id}`);
				let windowListener = (windowId) => {
					console.log(`Window remove event for id ${windowId}`);
					if (windowId == newWindow.id) {
						milk.fetchToken();
						browser.windows.onRemoved.removeListener(windowListener);
					}
				};
				browser.windows.onRemoved.addListener(windowListener);
			},
			(error) => {
				console.log(error);
			}
		);
	};

	// taskElement.addEventListener('keyup', (event) => {
	// 	if (event.keyCode === 13) {
	// 		linkElement.focus();
	// 	}
	// }, false);
	//
	// linkElement.addEventListener('keyup', (event) => {
	// 	if (event.keyCode === 13) {
	// 		submitButton.focus();
	// 	}
	// }, false);

	// refreshButton.addEventListener('click', () => {
	// }, false);
	//
	// plusButton.addEventListener('click', () => {
	// 	ml.util.setTextElement(addlistLabel, 'New List:');
	// 	addlistElement.value = '';
	// 	addListSubmitButton.disabled = false;
	// 	addListCancelButton.disabled = false;
	// 	contentElement.classList.add('hide');
	// 	addListForm.classList.remove('hide');
	// 	addlistElement.focus();
	// });
	//
	// addListCancelButton.addEventListener('click', () => {
	// 	hideAddList();
	// });
	//
	// var hideAddList = () => {
	// 	addListForm.classList.add('hide');
	// 	contentElement.classList.remove('hide');
	// };

	// addListSubmitButton.addEventListener('click', () => {
	// 	var formValid = true;
	// 	if (addlistElement.value !== '') {
	// 		ml.util.setTextElement(addlistLabel, 'New List:');
	// 	} else {
	// 		ml.util.setTextElement(addlistLabel, 'New List: List name can\'t be empty.');
	// 		formValid = false;
	// 	}
	// 	if (formValid) {
	// 		addListSubmitButton.disabled = true;
	// 		addListCancelButton.disabled = true;
	// 		// addon.port.emit('add-list', addlistElement.value);
	// 	}
	// });
	//
	// submitButton.addEventListener('click', () => {
	// 	var formValid = true;
	// 	if (taskElement.value !== '') {
	// 		ml.util.setTextElement(taskLabel, 'Task:');
	// 	} else {
	// 		ml.util.setTextElement(taskLabel, 'Task: Task name can\'t be empty.');
	// 		formValid = false;
	// 	}
	// 	if (linkElement.value === '' || validationRegex.test(linkElement.value)) {
	// 		ml.util.setTextElement(linkLabel, 'Link:');
	// 	} else {
	// 		ml.util.setTextElement(linkLabel, 'Link: Links must start with \'http://\' or \'https://\'.');
	// 		formValid = false;
	// 	}
	// 	if (formValid) {
	// 		// addon.port.emit('add-task', taskElement.value, linkElement.value, selectedElement.checked, selectedElement.value, listsElement.value);
	// 	}
	// }, false);

	// submitPermissionButton.addEventListener('click', () => {
	// }, false);
	//
	// var createOptionElement = (id, name, selected) => {
	// 	var option = document.createElement('option');
	// 	option.value = id;
	// 	var label = document.createTextNode(name);
	// 	option.appendChild(label);
	// 	if (selected) {
	// 		option.setAttribute('selected', 'selected');
	// 	}
	// 	return option;
	// };
