/* global self:false, document:false */

(function () {
	"use strict";

	var taskForm = document.getElementById("new-task");
	var taskElement = document.getElementById("task");
	var linkElement = document.getElementById("link");
	var listsElement = document.getElementById("lists");

	var refreshButton = document.getElementById("lists-refresh");
	//	var plusButton = document.getElementById("lists-plus");
	var submitButton = document.getElementById("submit");

	var statusImg = document.getElementById("status-img");
	var statusMsg = document.getElementById("status-msg");

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
		self.port.emit("update-lists");
	});

	//	plusButton.addEventListener("click", function click() {
	//		addon.port.emit("add-list", "dummy list");
	//	});

	submitButton.addEventListener("click", function click() {
		self.port.emit("add-task", taskElement.value, linkElement.value, listsElement.value);
		taskElement.value = "";
		linkElement.value = "";
	});

	//	Port

	self.port.on("update-task", function (title, url) {
		taskElement.value = title;
		linkElement.value = url;
		taskElement.focus();
	});

	self.port.on("update-lists", function (lists, defaultList) {
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

	self.port.on("set-state", function (clear, message, icon) {
		if (clear) {
			taskForm.classList.remove("hide");
			submitButton.classList.remove("hide");
			statusImg.classList.add("hide");
			statusMsg.classList.add("hide");
		} else {
			while (statusMsg.firstChild) {
				statusMsg.removeChild(statusMsg.firstChild);
			}
			statusMsg.appendChild(document.createTextNode(message));
			statusImg.setAttribute("src", "../icons/" + icon + ".svg");

			taskForm.classList.add("hide");
			submitButton.classList.add("hide");
			statusImg.classList.remove("hide");
			statusMsg.classList.remove("hide");
		}
	});

	//	Methods

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
