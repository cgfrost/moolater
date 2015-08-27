(function () {
	"use strict";

	module.exports = function (rtm, button) {

		var storage = require("sdk/simple-storage").storage,
			self = require("sdk/self"),
			tabs = require("sdk/tabs"),
			Panel = require("sdk/panel").Panel;

		var addTaskPanel = new Panel({
			contentURL: self.data.url("views/add/addTask.html"),
			contentScriptFile: self.data.url("views/add/addTask.js"),
			contentStyleFile: [self.data.url("views/common.css"),
							   self.data.url("views/add/addTask.css")],
			position: button,
			height: 150,
			width: 300,
			onHide: function () {
				button.state("window", {
					checked: false
				});
			},
			onShow: function () {
				addTaskPanel.port.emit("update-page-details", tabs.activeTab.title, tabs.activeTab.url);
			}
		});

		this.showAddTask = function () {
			addTaskPanel.show();
		};

		addTaskPanel.port.on("save-task", function (task, url) {
			console.log("Port.on(save-task): " + task + " url: " + url);
		});

	};

}());
