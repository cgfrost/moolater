(function () {
	"use strict";

	module.exports = function (rtm, button, events) {

		let storage = require("sdk/simple-storage").storage,
			windows = require("sdk/windows").browserWindows,
			self = require("sdk/self"),
			Panel = require("sdk/panel").Panel;

		events.on("init", (sender) => {
			console.log(`Accounts: Init recieved from ${sender}`);
			if (storage.token) {
				rtm.auth_token = storage.token;
			}
			if (storage.frob) {
				rtm.frob = storage.frob;
			}
		});

		let loginPanel = new Panel({
			contentURL: self.data.url("views/login/login.html"),
			position: button,
			height: 240,
			width: 350,
			onHide: () => {
				button.state("window", {
					checked: false
				});
			}
		});

		this.showLogin = () => {
			loginPanel.show();
		};

		this.isReady = () => {
			if (storage.token && storage.frob) {
				return true;
			}
			return false;
		};

		loginPanel.port.on("do-login", () => {
			console.log("Port.on(do-login)");
			rtm.get('rtm.auth.getFrob', {}, (resp) => {
				button.state("window", {
					checked: false
				});
				storage.frob = resp.rsp.frob;
				rtm.frob = resp.rsp.frob;
				windows.open({
					url: rtm.getAuthUrl(),
					onClose: () => {
						rtm.fetchToken();
					}
				});
			}, (fail) => {
				console.warn(fail);
			});
		});

	};

}());
