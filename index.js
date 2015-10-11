(function () {
	'use strict';

	let self = require('sdk/self'),
		ToggleButton = require('sdk/ui').ToggleButton,
		RememberTheMilk = require(self.data.url('milk/Milk.js')),
		Account = new require(self.data.url('account.js')),
		Tasks = new require(self.data.url('tasks.js')),
		Events = require(self.data.url('events.js')),
		ContectMenu = require(self.data.url('contextMenu.js')),
		data = JSON.parse(self.data.load('data.json')),
		Hotkey = require('sdk/hotkeys').Hotkey;

	let events = new Events();
	let milk = new RememberTheMilk(data, events, 'write');

	new ContectMenu(events);

	let button = new ToggleButton({
		id: 'moolater-toggle',
		label: 'Save to milk',
		icon: {
			'18': './logo/icon-18.png',
			'32': './logo/icon-32.png',
			'36': './logo/icon-36.png',
			'64': './logo/icon-64.png',
			'128': './logo/icon-128.png'
		},
		onClick: () => {
			events.do('go.mooLater');
		}
	});

	new Hotkey({
		combo: 'accel-shift-m',
		onPress: () => {
			events.do('go.mooLater');
		}
	});

	let tasks = new Tasks(milk, button, events);
	let account = new Account(milk, button);

	events.on('go.mooLater', () => {
		let showing = account.isShowing() || tasks.isShowing();
		if (showing) {
			tasks.hide();
			account.hide();
			button.state('window', {
				checked: false
			});
		} else {
			if (account.isReady()) {
				tasks.showAddTask();
			} else {
				account.showLogin();
			}
			button.state('window', {
				checked: true
			});
		}
	});

	(function () {
		if (account.isReady()) {
			milk.get('rtm.auth.checkToken', {}, () => {
				events.do('token.init');
			});
		}
	}());

}());
