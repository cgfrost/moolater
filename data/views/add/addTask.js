/* global self:false, document:false */

(function () {
	"use strict";

	var taskElement = document.getElementById("task");
	var linkElement = document.getElementById("link");
	var listsElement = document.getElementById("lists");
	taskElement.addEventListener("keyup", function onkeyup(event) {
		if (event.keyCode === 13) {
			linkElement.focus();
		}
	}, false);
	linkElement.addEventListener("keyup", function onkeyup(event) {
		if (event.keyCode === 13) {
			self.port.emit("save-task", taskElement.value, linkElement.value);
			taskElement.value = "";
			linkElement.value = "";
		}
	}, false);

	self.port.on("update-task", function (title, url) {
		console.log("Active window title is: '" + title + "' url is: '" + url + "'");
		taskElement.value = title;
		linkElement.value = url;
		taskElement.focus();
	});

	self.port.on("update-lists", function (lists, defaultList) {
		for (var i = 0; i < lists.length; i++) {
			console.log("List: " + lists[i].name + " Id: " + lists[i].id);
		}
		listsElement.value = lists;
	});

	self.port.on("task-saved", function (title, time) {
		taskElement.value = "Task Saved: " + title + " (" + time + ")";
	});

	self.port.on("task-save-error", function (fail) {
		taskElement.value = "Error: " + fail;
	});

}());
