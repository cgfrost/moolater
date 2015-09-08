(function () {
	"use strict";

	module.exports = function (rtm, button, tasks) {

		var storage = require("sdk/simple-storage").storage,
			windows = require("sdk/windows").browserWindows,
			self = require("sdk/self"),
			Panel = require("sdk/panel").Panel;

		var loginPanel = new Panel({
			contentURL: self.data.url("views/login/login.html"),
			position: button,
			height: 240,
			width: 350,
			onHide: function () {
				button.state("window", {
					checked: false
				});
			}
		});

		this.showLogin = function () {
			loginPanel.show();
		};

		this.isReady = function () {
			if (storage.token && storage.frob) {
				return true;
			}
			return false;
		};

		loginPanel.port.on("do-login", function () {
			console.log("Port.on(do-login)");
			rtm.get('rtm.auth.getFrob', {},
				function (resp) {
					button.state("window", {
						checked: false
					});
					storage.frob = resp.rsp.frob;
					rtm.frob = resp.rsp.frob;
					windows.open({
						url: rtm.getAuthUrl(),
						onClose: function () {
							rtm.fetchToken(tasks.fetchLists);
						}
					});
				},
				function (fail) {
					console.warn(fail);
				}
			);
		});

		if (storage.token) {
			rtm.auth_token = storage.token;
		}

		if (storage.frob) {
			rtm.frob = storage.frob;
		}

	};

}());
