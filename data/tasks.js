(function () {
	"use strict";

	module.exports = function (rtm, button) {

		var tabs = require("sdk/tabs"),
			self = require("sdk/self"),
			preferences = require("sdk/simple-prefs").prefs,
			Panel = require("sdk/panel").Panel,
			me = this;

		var addTaskPanel = new Panel({
			contentURL: self.data.url("views/add/addTask.html"),
			contentScriptFile: self.data.url("views/add/addTask.js"),
			contentStyleFile: [self.data.url("views/common.css"),
							   self.data.url("views/add/addTask.css")],
			position: button,
			height: 300,
			width: 350,
			onHide: function () {
				button.state("window", {
					checked: false
				});
			},
			onShow: function () {
				var title = preferences.useTitle ? tabs.activeTab.title : "";
				var link = preferences.useLink ? tabs.activeTab.url : "";
				var defaultList = preferences.defaultList;
				if (defaultList === null || defaultList === "") {
					defaultList = "Inbox";
				}
				addTaskPanel.port.emit("update-task", title, link);
				addTaskPanel.port.emit("update-lists", me.lists, defaultList);
			}
		});

		this.showAddTask = function () {
			addTaskPanel.show();
		};

		addTaskPanel.port.on("save-task", function (name, link, listId) {
			console.log("Port.on(save-task): " + name + " url: " + link + " listId: " + listId);
			rtm.get('rtm.tasks.add', {
					list_id: listId,
					name: name
				},
				function (resp) {
					var newTask = resp.rsp.task;
					rtm.get('rtm.tasks.setURL', {
							list_id: listId,
							taskseries_id: newTask.series_id,
							task_id: newTask.id,
							url: link
						},
						function (resp) {
							addTaskPanel.port.emit("task-saved", name, resp.rsp.taskseries.created);
						},
						function (fail) {
							addTaskPanel.port.emit("task-save-error", fail);
						}
					);
				},
				function (fail) {
					addTaskPanel.port.emit("task-save-error", fail);
				}
			);
		});

		addTaskPanel.port.on("update-lists", function () {
			me.getLists(function (lists) {
				me.lists = lists;
				var defaultList = preferences.defaultList;
				if (defaultList === null || defaultList === "") {
					defaultList = "Inbox";
				}
				addTaskPanel.port.emit("update-lists", me.lists, defaultList);
			});
		});

		me.getLists = function (callback) {
			rtm.get('rtm.lists.getList', {},
				function (resp) {
					callback(resp.rsp.lists.list);
				},
				function (fail) {
					console.warn(fail);
				}
			);
		};

		//		this.addList = function (name) {
		//			rtm.get('rtm.lists.add', {
		//					name: name
		//				},
		//				function (resp) {
		//					var newList = resp.rsp.list;
		//				},
		//				function (fail) {
		//					console.warn(fail);
		//				}
		//			);
		//		};

	};

}());
