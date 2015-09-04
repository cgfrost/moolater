/* global addon:false, document:false */

(function () {
	"use strict";

	var taskForm = document.getElementById("new-task");
	var taskElement = document.getElementById("task");
	var linkElement = document.getElementById("link");
	var listsElement = document.getElementById("lists");

	var refreshButton = document.getElementById("lists-refresh");
	//	var plusButton = document.getElementById("lists-plus");
	var submitButton = document.getElementById("submit");

	var status = document.getElementById("status");
	var statusMsg = document.getElementById("status-msg");
	var statusImg = document.getElementById("status-img");

	//	Event Listeners

	taskElement.addEventListener("keyup", function onkeyup(event) {
		if (event.keyCode === 13) {
			linkElement.focus();
		}
	}, false);

	linkElement.addEventListener("keyup", function onkeyup(event) {
		if (event.keyCode === 13) {
			submitButton.focus();
		}
	}, false);

	refreshButton.addEventListener("click", function click() {
		addon.port.emit("update-lists");
	});

	//	plusButton.addEventListener("click", function click() {
	//		addon.port.emit("add-list", "dummy list");
	//	});

	submitButton.addEventListener("click", function click() {
		addon.port.emit("add-task", taskElement.value, linkElement.value, listsElement.value);
		taskElement.value = "";
		linkElement.value = "";
	});

	//	Port

	addon.port.on("update-task", function (title, url) {
		taskElement.value = title;
		linkElement.value = url;
		taskElement.focus();
	});

	addon.port.on("update-lists", function (lists, defaultList) {
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

	addon.port.on("set-state", function (clear, message, iconName) {
		if (clear) {
			taskForm.classList.remove("hide");
			status.classList.add("hide");
		} else {
			while (statusMsg.firstChild) {
				statusMsg.removeChild(statusMsg.firstChild);
			}
			statusMsg.appendChild(document.createTextNode(message));
			setIconState(statusImg, iconName);
			taskForm.classList.add("hide");
			status.classList.remove("hide");
		}
	});

	addon.port.on("set-refresh-button-icon", function (iconName) {
		setIconState(refreshButton.firstElementChild, iconName);
	});

//	addon.port.on("set-plus-button-icon", function (iconName) {
//		setIconState(plusButton.firstElementChild, iconName);
//	});

	//	Methods

	var setIconState = function (icon, iconName) {
		icon.setAttribute("src", "../icons/" + iconName + ".svg");
	};

	var createOptionElement = function (id, name, selected) {
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
