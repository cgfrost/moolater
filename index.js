(function () {
	'use strict';

	let self = require('sdk/self'),
		ToggleButton = require('sdk/ui').ToggleButton,
		RememberTheMilk = require(self.data.url('rtm.js')),
		Account = new require(self.data.url('account.js')),
		Tasks = new require(self.data.url('tasks.js')),
		events = require(self.data.url('events.js')),
		Hotkey = require("sdk/hotkeys").Hotkey;

	let rtm = new RememberTheMilk(events, 'write');

	let button = new ToggleButton({
		id: 'moolater-link',
		label: 'Save to RTM',
		icon: {
			'18': './logo/icon-18.png',
			'32': './logo/icon-32.png',
			'36': './logo/icon-36.png',
			'64': './logo/icon-64.png',
			'128': './logo/icon-128.png'
		}
	});

	new Hotkey({
		combo: "accel-shift-m",
		onPress: function () {
			button.click();
		}
	});

	let tasks = new Tasks(rtm, button, events);
	let account = new Account(rtm, button, events);

	button.on('change', (state) => {
		if (state.checked === true) {
			if (account.isReady()) {
				tasks.showAddTask();
			} else {
				account.showLogin();
			}
		} else {
			tasks.hide();
			account.hide();
		}
	});

	if (account.isReady()) {
		rtm.get('rtm.auth.checkToken', {}, () => {
			events.do('token.init', 'index');
		});
	}

}());
