(function () {
	"use strict";

	module.exports = function (rtm, button) {

		var tabs = require("sdk/tabs"),
			self = require("sdk/self"),
			preferences = require("sdk/simple-prefs").prefs,
			Panel = require("sdk/panel").Panel,
			setTimeout = require("sdk/timers").setTimeout,
			me = this;

		me.lists = [];

		var addTaskPanel = new Panel({
			contentURL: self.data.url("views/add/addTask.html"),
			contentScriptFile: self.data.url("views/add/addTask.js"),
			contentStyleFile: [self.data.url("views/common.css"),
							   self.data.url("views/add/addTask.css")],
			position: button,
			height: 330,
			width: 350,
			onHide: function () {
				button.state("window", {
					checked: false
				});
			},
			onShow: function () {
				var title = preferences.useTitle ? tabs.activeTab.title : "";
				var link = preferences.useLink ? tabs.activeTab.url : "";

				addTaskPanel.port.emit("update-task", title, link);
				addTaskPanel.port.emit("update-lists", me.lists, me.getDefaultList());
			}
		});

		this.showAddTask = function () {
			addTaskPanel.show();
		};

		addTaskPanel.port.on("add-task", function (name, link, listId) {
			addTaskPanel.port.emit("set-state", false, "Saving", "loading");
			var useSmartAdd = preferences.useSmartAdd ? 1 : 0;
			rtm.get('rtm.tasks.add', {
					list_id: listId,
					name: name,
					timeline: rtm.timeline,
					parse: useSmartAdd
				},
				function (resp) {
					var newTask = resp.rsp.list;
					rtm.get('rtm.tasks.setURL', {
							list_id: newTask.id,
							taskseries_id: newTask.taskseries.id,
							task_id: newTask.taskseries.task.id,
							url: link,
							timeline: rtm.timeline
						},
						function () {
							me.flashState(name, "done");
						},
						function (fail) {
							me.flashState(fail, "error");
						}
					);
				},
				function (fail) {
					me.flashState(fail, "error");
				}
			);
		});

		me.flashState = function (message, icon) {
			addTaskPanel.port.emit("set-state", false, message, icon);
			setTimeout(function () {
				addTaskPanel.hide();
			}, 5000);
			setTimeout(function () {
				addTaskPanel.port.emit("set-state", true);
			}, 5100);
		};

		addTaskPanel.port.on("update-lists", function () {
			me.fetchLists();
		});

		me.fetchLists = function () {
			rtm.get('rtm.lists.getList', {},
				function (resp) {
					me.lists = resp.rsp.lists.list;
					if (addTaskPanel.isShowing) {
						addTaskPanel.port.emit("update-lists", me.lists, me.getDefaultList());
					}
				},
				function (fail) {
					console.warn(fail);
				}
			);
		};

		me.getDefaultList = function () {
			var defaultList = preferences.defaultList;
			if (defaultList === null || defaultList === "") {
				defaultList = "Inbox";
			}
			return defaultList;
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
