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
	var addlistStatus = document.getElementById('add-list-status');
	var addListSubmitButton = document.getElementById('add-list-submit');
	var addListCancelButton = document.getElementById('add-list-cancel');

	var loginElement = document.getElementById('login');

	var submitButton = document.getElementById('submit');
	var submitPermissionButton = document.getElementById('submit-permission');

	var validationRegex = new RegExp('^https?://');

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
		// addon.port.emit('update-lists');
	}, false);

	// addon.port.on('hide-add-list', () => {
	// 	hideAddList();
	// });
	//
	// addon.port.on('set-add-list-msg', (msg) => {
	// 	ml.util.setTextElement(addlistLabel, `New List: ${msg}`);
	// });

	// addon.port.on('set-add-list-status', () => {
	// 	addListSubmitButton.disabled = false;
	// 	addListCancelButton.disabled = false;
	// });

	plusButton.addEventListener('click', () => {
		ml.util.setTextElement(addlistLabel, 'New List:');
		addlistElement.value = '';
		addListSubmitButton.disabled = false;
		addListCancelButton.disabled = false;
		contentElement.classList.add('hide');
		addListForm.classList.remove('hide');
		addlistElement.focus();
	});

	addListCancelButton.addEventListener('click', () => {
		hideAddList();
	});

	var hideAddList = () => {
		addListForm.classList.add('hide');
		contentElement.classList.remove('hide');
	};

	addListSubmitButton.addEventListener('click', () => {
		var formValid = true;
		if (addlistElement.value !== '') {
			ml.util.setTextElement(addlistLabel, 'New List:');
		} else {
			ml.util.setTextElement(addlistLabel, 'New List: List name can\'t be empty.');
			formValid = false;
		}
		if (formValid) {
			addListSubmitButton.disabled = true;
			addListCancelButton.disabled = true;
			// addon.port.emit('add-list', addlistElement.value);
		}
	});

	submitButton.addEventListener('click', () => {
		var formValid = true;
		if (taskElement.value !== '') {
			ml.util.setTextElement(taskLabel, 'Task:');
		} else {
			ml.util.setTextElement(taskLabel, 'Task: Task name can\'t be empty.');
			formValid = false;
		}
		if (linkElement.value === '' || validationRegex.test(linkElement.value)) {
			ml.util.setTextElement(linkLabel, 'Link:');
		} else {
			ml.util.setTextElement(linkLabel, 'Link: Links must start with \'http://\' or \'https://\'.');
			formValid = false;
		}
		if (formValid) {
			// addon.port.emit('add-task', taskElement.value, linkElement.value, selectedElement.checked, selectedElement.value, listsElement.value);
		}
	}, false);


	loginElement.classList.remove('hide');

	submitPermissionButton.addEventListener('click', () => {
	}, false);

	// addon.port.on('show-use-selected-text', (selectedText) => {
	// 	selectedElement.checked = true;
	// 	selectedElement.value = selectedText;
	// 	selectedLabel.classList.remove('hide');
	// });

	// addon.port.on('hide-use-selected-text', () => {
	// 	selectedElement.checked = false;
	// 	selectedElement.value = '';
	// 	selectedLabel.classList.add('hide');
	// });
	//
	// addon.port.on('update-task', (title, url) => {
	// 	ml.util.setTextElement(taskLabel, 'Task:');
	// 	ml.util.setTextElement(linkLabel, 'Link:');
	// 	taskElement.value = title;
	// 	linkElement.value = url;
	// 	taskElement.focus();
	// });
	//
	// addon.port.on('update-add-list', () => {
	// 	addListForm.classList.add('hide');
	// 	addlistElement.value = '';
	// });
	//
	// addon.port.on('update-lists', (lists, defaultList) => {
	// 	while (listsElement.firstChild) {
	// 		listsElement.removeChild(listsElement.firstChild);
	// 	}
	// 	var defaultFound = false;
	// 	for (var i = 0; i < lists.length; i++) {
	// 		if (lists[i].smart === '0') {
	// 			var selected = defaultList === lists[i].name;
	// 			if (selected) {
	// 				defaultFound = true;
	// 			}
	// 			var newOption = createOptionElement(lists[i].id, lists[i].name, selected);
	// 			listsElement.appendChild(newOption);
	// 		}
	// 	}
	// 	if (!defaultFound) {
	// 		listsElement.selectedIndex = "0";
	// 	}
	// });

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

	// addon.port.on('set-refresh-button-icon', (iconName) => {
	// 	ml.util.setIconState(refreshButton.firstElementChild, iconName);
	// });
	//
	// addon.port.on('set-add-list-status', (iconName) => {
	// 	ml.util.setIconState(addlistStatus.firstElementChild, iconName);
	// });

}());
