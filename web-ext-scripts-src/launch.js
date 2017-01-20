/* global addon:false, document:false, window:false */

import MilkAuth from './auth/MilkAuth.js';
'use strict';

	var addTaskSection = document.getElementById('content');
	var addListSection = document.getElementById('add-list');
	var loginSection = document.getElementById('login');
	var statusSection = document.getElementById('status');

	// var taskElement = document.getElementById('task');
	// var taskLabel = document.getElementById('task-label');
	// var linkElement = document.getElementById('link');
	// var linkLabel = document.getElementById('link-label');
	// var listsElement = document.getElementById('lists');
	// var refreshButton = document.getElementById('lists-refresh');
	// var plusButton = document.getElementById('lists-plus');
	//
	// var selectedElement = document.getElementById('selected-text');
	// var selectedLabel = document.getElementById('selected-text-label');
	//
	//
	// var addlistElement = document.getElementById('list');
	// var addlistLabel = document.getElementById('list-label');
	// var addlistStatus = document.getElementById('add-list-status');
	// var addListSubmitButton = document.getElementById('add-list-submit');
	// var addListCancelButton = document.getElementById('add-list-cancel');
	//
	// var submitButton = document.getElementById('submit');
	// var submitPermissionButton = document.getElementById('submit-permission');

	var validationRegex = new RegExp('^https?://');

	// IS THE USER AUTHENTICATED

  let data = '{"a": "bf427f2504b074dc361c18d255354649", "b": "9d98f15fda6ba725"}';
  let milkAuth = new MilkAuth(JSON.parse(data));

	// Initialization
	document.addEventListener('DOMContentLoaded', () => {
		milkAuth.isUserAuthenticated(
			(result) => {
				if(result.frob && result.token) {
					showSection(addTaskSection);
				} else {
					showSection(loginSection);
				}
			},
			(error) => {
				console.error(`Error while retreiving data from storage ${error}`);
				showSection(loginSection);
			});
	});

	let showSection = (element) => {
		var sections = document.getElementsByClassName("section");
		for (let section of sections) {
 			section.classList.add('hide');
		}
		element.classList.remove('hide');
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
