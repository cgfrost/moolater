/* global self:false, document:false */

(function () {
	"use strict";

	var taskElement = document.getElementById("task");
	var linkElement = document.getElementById("link");
	var listsElement = document.getElementById("lists");
	var refreshButton = document.getElementById("lists-refresh");
	var plusButton = document.getElementById("lists-plus");
	var submitButton = document.getElementById("submit");

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

	plusButton.addEventListener("click", function click() {
		self.port.emit("add-list", "dummy list");
	});

	submitButton.addEventListener("click", function click() {
		self.port.emit("add-task", taskElement.value, linkElement.value, listsElement.value);
		taskElement.value = "";
		linkElement.value = "";
	});

	self.port.on("update-task", function (title, url) {
		taskElement.value = title;
		linkElement.value = url;
		taskElement.focus();
	});

	self.port.on("update-lists", function (lists, defaultList) {
		while (listsElement.firstChild) {
			listsElement.removeChild(listsElement.firstChild);
		}
		console.log("Default List: " + defaultList);
		for (var i = 0; i < lists.length; i++) {
			console.log("List: " + lists[i].name + " Id: " + lists[i].id + " Smart: " + lists[i].smart);
			if (lists[i].smart === "0") {
				var selected = defaultList === lists[i].name;
				var newOption = createOptionElement(lists[i].id, lists[i].name, selected);
				listsElement.appendChild(newOption);
			}
		}
	});

	self.port.on("task-saved", function (title) {
		taskElement.value = "Task Saved: " + title;
	});

	self.port.on("task-save-error", function (fail) {
		taskElement.value = "Error: " + fail;
	});

}());
