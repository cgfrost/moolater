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
			"18": "./logo/icon-18.png",
			"32": "./logo/icon-32.png",
			"36": "./logo/icon-36.png",
			"64": "./logo/icon-64.png",
			"128": "./logo/icon-128.png"
		},
		onChange: function (state) {
			if (state.checked === true) {
				if (account.isReady()) {
					tasks.showAddTask();
				} else {
					account.showLogin();
				}
			}
		}
	});

	var account = new Account(rtm, button);
	var tasks = new Tasks(rtm, button);

//	console.log("SETUP");
	if (account.isReady()) {
//		console.log("READY - CHECKING TOKEN");
		rtm.get('rtm.auth.checkToken', {},
			function () {
				rtm.setTimeline();
				tasks.fetchLists();
			});
	}



}());
