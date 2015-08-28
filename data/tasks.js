(function () {
	"use strict";

	module.exports = function (rtm, button) {

		var storage = require("sdk/simple-storage").storage,
			tabs = require("sdk/tabs"),
			self = require("sdk/self"),
			preferences = require("sdk/simple-prefs").prefs,
			Panel = require("sdk/panel").Panel;

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
				addTaskPanel.port.emit("update-page-details", title, link);
			}
		});

		this.showAddTask = function () {
			addTaskPanel.show();
		};

		addTaskPanel.port.on("save-task", function (task, url) {
			console.log("Port.on(save-task): " + task + " url: " + url);
			var list = preferences.defaultList;
			if (list === null || list === "") {
				list = "Inbox";
			}
			rtm.tasks.add
		});

		this.addTask = function (name, list_id) {
			rtm.get('rtm.tasks.add', {
					list_id: list_id,
					name: name
				},
				function (resp) {
					button.state("window", {
						checked: false
					});
					storage.frob = resp.rsp.frob;
					var authUrl = rtm.getAuthUrl(storage.frob);
					console.log("authUrl: " + authUrl);

					rtm.get('rtm.tasks.setURL', {
							frob: storage.frob
						},
						function (resp) {
							rtm.setAuthToken(resp.rsp.auth.token);
							console.log("token: " + resp);
							storage.token = resp.rsp.auth.token;
						}
					);
				},
				function (response) {
					console.log("Network Error: " + response.status + "-" + response.statusText);
				}
			);
		};

		this.getListId = function (listName) {
			rtm.get('rtm.lists.getList', {},
				function (resp) {
					var lists = resp.rsp.lists;

				},
				function (response) {
					console.log("Network Error: " + response.status + "-" + response.statusText);
				}
			);
		};

		this.addList = function (name) {
			rtm.get('rtm.lists.add', {
					timeline: "",
					name: ""
				},
				function (resp) {
					var newList = resp.rsp.list;
				},
				function (response) {
					console.log("Network Error: " + response.status + "-" + response.statusText);
				}
			);
		};

	};

}());
