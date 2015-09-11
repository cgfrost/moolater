(function () {
	"use strict";

	let self = require("sdk/self"),
		ToggleButton = require("sdk/ui").ToggleButton,
		RememberTheMilk = require(self.data.url("rtm.js")),
		Account = new require(self.data.url("account.js")),
		Tasks = new require(self.data.url("tasks.js")),
		events = require(self.data.url("events.js"));

	let {
		apiKey, apiSecret
	} = JSON.parse(self.data.load("keys.json"));

	let rtm = new RememberTheMilk(apiKey, apiSecret, events, "write");

	let button = new ToggleButton({
		id: "moolater-link",
		label: "Save to RTM",
		icon: {
			"18": "./logo/icon-18.png",
			"32": "./logo/icon-32.png",
			"36": "./logo/icon-36.png",
			"64": "./logo/icon-64.png",
			"128": "./logo/icon-128.png"
		}
	});

	let tasks = new Tasks(rtm, button, events);
	let account = new Account(rtm, button, events);

	button.on("change", (state) => {
		if (state.checked === true) {
			if (account.isReady()) {
				tasks.showAddTask();
			} else {
				account.showLogin();
			}
		}
	});

	events.do("init", "index.js");

	if (account.isReady()) {
		rtm.get('rtm.auth.checkToken', {}, () => {
			rtm.setTimeline();
			tasks.fetchLists();
		});
	}


}());
