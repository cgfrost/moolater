(function () {
	"use strict";

	// a dummy function, to show how tests work, look at test/test-index.js
	function dummy(text, callback) {
		callback(text);
	}

	exports.dummy = dummy;

	var ui = require("sdk/ui"),
		Panel = require("sdk/panel").Panel,
		self = require("sdk/self"),
		tabs = require("sdk/tabs"),
		windows = require("sdk/windows").browserWindows,
		storage = require("sdk/simple-storage").storage,
		RememberTheMilk = require(self.data.url("rtm.js"));

	var keys = JSON.parse(self.data.load("keys.json"));
	var apiKey = keys.api_key;
	var apiSecret = keys.shared_secret;
	var loggedIn = false;

	var rtm = new RememberTheMilk(apiKey, apiSecret, "write", "json");

	var button = new ui.ToggleButton({
		id: "moolater-link",
		label: "Save to RTM",
		icon: {
			"18": "./icon-18.png",
			"32": "./icon-32.png",
			"36": "./icon-36.png",
			"64": "./icon-64.png",
			"128": "./icon-128.png"
		},
		onChange: function (state) {
			handletoggle(state);
		}
	});

	var loginPanel = new Panel({
		contentURL: self.data.url("login/login.html"),
		contentScriptFile: self.data.url("login/login.js"),
		onHide: handleHide,
		onShow: function() {
			loginPanel.port.emit("login-failed", "msg");
		}
	});

	var addTaskPanel = new Panel({
		contentURL: self.data.url("add/addTask.html"),
		contentScriptFile: self.data.url("add/addTask.js"),
		onHide: handleHide,
		onShow: function () {
			addTaskPanel.port.emit("update-page-details", tabs.activeTab.title, tabs.activeTab.url);
		}
	});

	function handletoggle(state) {
		console.log("Handle toggle: " + state.label + " checked state: " + state.checked);
		if (state.checked) {
			if (loggedIn) {
				addTaskPanel.show({
					position: button
				});
			} else {
				loginPanel.show({
					position: button
				});
			}
		}
	}

	function handleHide() {
		button.state("window", {
			checked: false
		});
	}

	addTaskPanel.port.on("save-task", function (text) {
		console.log("Port.on(save-task): " + text);
	});

	loginPanel.port.on("do-login", function () {
		console.log("Port.on(do-login)");
		rtm.get('rtm.auth.getFrob', {}, function (resp) {
			storage.frob = resp.rsp.frob;
			var authUrl = rtm.getAuthUrl(storage.frob);
			console.log("authUrl: " + authUrl);
			windows.open({
				url: authUrl,
				onClose: function () {
					rtm.get('rtm.auth.getToken', {
							frob: storage.frob
						},
						function (resp) {
							rtm.setAuthToken(resp.rsp.auth.token);
							console.log("token: " + resp);
							storage.token = resp.rsp.auth.token;
						});
				}
			});

		}, function (response) {
			console.log("Network Error: " + response.status + "-" + response.statusText);
		});
	});

	exports.dummy = dummy;

}());
