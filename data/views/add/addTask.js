/* global addon:false, document:false, window:false */

(function () {
	'use strict';

	var taskElement = document.getElementById('task');
	var taskLabel = document.getElementById('task-label');
	var linkElement = document.getElementById('link');
	var linkLabel = document.getElementById('link-label');
	var listsElement = document.getElementById('lists');
	var refreshButton = document.getElementById('lists-refresh');
	var plusButton = document.getElementById('lists-plus');

	var selectedElement = document.getElementById('selected-text');
	var selectedLabel = document.getElementById('selected-text-label');

	var contentElement = document.getElementById('content');
	var addListForm = document.getElementById('add-list');
	var addlistElement = document.getElementById('list');
	var addlistLabel = document.getElementById('list-label');
	var addListSubmitButton = document.getElementById('add-list-submit');
	var addListCancelButton = document.getElementById('add-list-cancel');

	var submitButton = document.getElementById('submit');

	var validationRegex = new RegExp('^https?://');
	var util = window.util;

	taskElement.addEventListener('keyup', (event) => {
		if (event.keyCode === 13) {
			linkElement.focus();
		}
	}, false);

	linkElement.addEventListener('keyup', (event) => {
		if (event.keyCode === 13) {
			submitButton.focus();
		}
	}, false);

	refreshButton.addEventListener('click', () => {
		addon.port.emit('update-lists');
	}, false);

	plusButton.addEventListener('click', () => {
		util.setTextElement(addlistLabel, 'New List:');
		contentElement.classList.add('hide');
		addListForm.classList.remove('hide');
		addlistElement.focus();
	});

	addListCancelButton.addEventListener('click', () => {
		addListForm.classList.add('hide');
		contentElement.classList.remove('hide');
	});

	addListSubmitButton.addEventListener('click', () => {
		var formValid = true;
		if (addlistElement.value !== '') {
			util.setTextElement(addlistLabel, 'New List:');
		} else {
			util.setTextElement(addlistLabel, 'New List: List name can\'t be empty.');
			formValid = false;
		}
		if (formValid) {
			addon.port.emit('add-list', listElement.value);
		}
	});

	submitButton.addEventListener('click', () => {
		var formValid = true;
		if (taskElement.value !== '') {
			util.setTextElement(taskLabel, 'Task:');
		} else {
			util.setTextElement(taskLabel, 'Task: Task name can\'t be empty.');
			formValid = false;
		}
		if (linkElement.value === '' || validationRegex.test(linkElement.value)) {
			util.setTextElement(linkLabel, 'Link:');
		} else {
			util.setTextElement(linkLabel, 'Link: Links must start with \'http://\' or \'https://\'.');
			formValid = false;
		}
		if (formValid) {
			addon.port.emit('add-task', taskElement.value, linkElement.value, selectedElement.checked, selectedElement.value, listsElement.value);
		}
	}, false);

	addon.port.on('show-use-selected-text', (selectedText) => {
		selectedElement.checked = true;
		selectedElement.value = selectedText;
		selectedLabel.classList.remove('hide');
	});

	addon.port.on('hide-use-selected-text', () => {
		selectedElement.checked = false;
		selectedElement.value = '';
		selectedLabel.classList.add('hide');
	});

	addon.port.on('update-task', (title, url) => {
		util.setTextElement(taskLabel, 'Task:');
		util.setTextElement(linkLabel, 'Link:');
		taskElement.value = title;
		linkElement.value = url;
		taskElement.focus();
	});

	addon.port.on('update-add-list', () => {
		addListForm.classList.add('hide');
		addlistElement.value = '';
	});

	addon.port.on('update-lists', (lists, defaultList) => {
		while (listsElement.firstChild) {
			listsElement.removeChild(listsElement.firstChild);
		}
		var defaultFound = false;
		for (var i = 0; i < lists.length; i++) {
			if (lists[i].smart === '0') {
				var selected = defaultList === lists[i].name;
				if (selected) {
					defaultFound = true;
				}
				var newOption = createOptionElement(lists[i].id, lists[i].name, selected);
				listsElement.appendChild(newOption);
			}
		}
		if (!defaultFound) {
			listsElement.selectedIndex = "0";
		}
	});

	var createOptionElement = (id, name, selected) => {
		var option = document.createElement('option');
		option.value = id;
		var label = document.createTextNode(name);
		option.appendChild(label);
		if (selected) {
			option.setAttribute('selected', 'selected');
		}
		return option;
	};

	addon.port.on('set-refresh-button-icon', (iconName) => {
		util.setIconState(refreshButton.firstElementChild, iconName);
	});

	addon.port.on('set-add-list-status', (iconName) => {
		util.setIconState(plusButton.firstElementChild, iconName);
	});

}());
