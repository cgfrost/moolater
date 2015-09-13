/* global addon:false, document:false */

(function () {
	"use strict";

	var contentElement = document.getElementById("content");
	var taskElement = document.getElementById("task");
	var taskLabel = document.getElementById("task-label");
	var linkElement = document.getElementById("link");
	var linkLabel = document.getElementById("link-label");
	var listsElement = document.getElementById("lists");

	var refreshButton = document.getElementById("lists-refresh");
	//	var plusButton = document.getElementById("lists-plus");
	var submitButton = document.getElementById("submit");

	var status = document.getElementById("status");
	var statusMsg = document.getElementById("status-msg");
	var statusImg = document.getElementById("status-img");

	var validationRegex = new RegExp("^https?://");

	//	Event Listeners

	taskElement.addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			linkElement.focus();
		}
	}, false);

	linkElement.addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			submitButton.focus();
		}
	}, false);

	refreshButton.addEventListener("click", () => {
		addon.port.emit("update-lists");
	});

	//	plusButton.addEventListener("click", function click() {
	//		addon.port.emit("add-list", "dummy list");
	//	});

	submitButton.addEventListener("click", () => {
		var formValid = true;
		if (taskElement.value !== "") {
			setTextElement(taskLabel, "Task:");
		} else {
			setTextElement(taskLabel, "Task: Task name can't be empty.");
			formValid = false;
		}
		if (linkElement.value === "" || validationRegex.test(linkElement.value)) {
			setTextElement(linkLabel, "Link:");
		} else {
			setTextElement(linkLabel, "Link: Links must start with 'http://' or 'https://'.");
			formValid = false;
		}
		if (formValid) {
			addon.port.emit("add-task", taskElement.value, linkElement.value, listsElement.value);
		}
	});

	//	Port

	addon.port.on("update-task", (title, url) => {
		taskElement.value = title;
		linkElement.value = url;
		taskElement.focus();
	});

	addon.port.on("update-lists", (lists, defaultList) => {
		while (listsElement.firstChild) {
			listsElement.removeChild(listsElement.firstChild);
		}
		for (var i = 0; i < lists.length; i++) {
			if (lists[i].smart === "0") {
				var selected = defaultList === lists[i].name;
				var newOption = createOptionElement(lists[i].id, lists[i].name, selected);
				listsElement.appendChild(newOption);
			}
		}
	});

	addon.port.on("set-state", (clear, message, iconName) => {
		if (clear) {
			contentElement.classList.remove("hide");
			status.classList.add("hide");
		} else {
			setTextElement(statusMsg, message);
			setIconState(statusImg, iconName);
			contentElement.classList.add("hide");
			status.classList.remove("hide");
		}
	});

	addon.port.on("set-refresh-button-icon", (iconName) => {
		setIconState(refreshButton.firstElementChild, iconName);
	});

	//	addon.port.on("set-plus-button-icon", function (iconName) {
	//		setIconState(plusButton.firstElementChild, iconName);
	//	});

	//	Methods

	var setIconState = (icon, iconName) => {
		icon.setAttribute("src", "../icons/" + iconName + ".svg");
	};

	var setTextElement = (textElement, text) =>{
		while (textElement.firstChild) {
			textElement.removeChild(textElement.firstChild);
		}
		textElement.appendChild(document.createTextNode(text));
	};

	var createOptionElement = (id, name, selected) => {
		var option = document.createElement("option");
		option.value = id;
		var label = document.createTextNode(name);
		option.appendChild(label);
		if (selected) {
			option.setAttribute("selected", "selected");
		}
		return option;
	};

}());
