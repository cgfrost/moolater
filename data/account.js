(function () {
	"use strict";

	module.exports = function (rtm, button) {

		var storage = require("sdk/simple-storage").storage,
			windows = require("sdk/windows").browserWindows,
			self = require("sdk/self"),
			Panel = require("sdk/panel").Panel;

		var loginPanel = new Panel({
			contentURL: self.data.url("views/login/login.html"),
			contentScriptFile: self.data.url("views/login/login.js"),
			contentStyleFile: [self.data.url("views/common.css"),
							   self.data.url("views/login/login.css")],
			position: button,
			height: 240,
			width: 350,
			onHide: function () {
				button.state("window", {
					checked: false
				});
			},
			onShow: function () {
				//loginPanel.port.emit("login-failed", "msg");
			}
		});

		this.showLogin = function () {
			loginPanel.show();
		};

		this.isLoggedIn = function () {
			if (storage.token && storage.frob) {
				rtm.setTimeline();
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
					rtm.setFrob(resp.rsp.frob);
					windows.open({
						url: rtm.getAuthUrl(),
						onClose: function () {
							rtm.get('rtm.auth.getToken', {},
								function (resp) {
									rtm.setAuthToken(resp.rsp.auth.token);
									console.log("token: " + resp);
									storage.token = resp.rsp.auth.token;
									rtm.setTimeline();
								}
							);
						}
					});

				},
				function (response) {
					console.log("Network Error: " + response.status + "-" + response.statusText);
				}
			);
		});

	};

}());