(function () {
	"use strict";

	var self = require("sdk/self"),
		ToggleButton = require("sdk/ui").ToggleButton,
		RememberTheMilk = require(self.data.url("rtm.js")),
		Account = new require(self.data.url("account.js")),
		Tasks = new require(self.data.url("tasks.js"));

	var keys = JSON.parse(self.data.load("keys.json"));
	var apiKey = keys.api_key;
	var apiSecret = keys.shared_secret;
	var rtm = new RememberTheMilk(apiKey, apiSecret, "write");

	var button = new ToggleButton({
		id: "moolater-link",
		label: "Save to RTM",
		icon: {
			"18": "./images/icon-18.png",
			"32": "./images/icon-32.png",
			"36": "./images/icon-36.png",
			"64": "./images/icon-64.png",
			"128": "./images/icon-128.png"
		},
		onChange: function (state) {
			handletoggle(state);
		}
	});

	var account = new Account(rtm, button);
	var tasks = new Tasks(rtm, button);

	function handletoggle(state) {
		console.log("Handle toggle: " + state.label + " checked state: " + state.checked);
		if (state.checked === true) {
			if (account.isLoggedIn()) {
				tasks.showAddTask();
			} else {
				account.showLogin();
			}
		}
	}

}());
