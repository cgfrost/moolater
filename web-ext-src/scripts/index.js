(function () {
	'use strict';

	let	RememberTheMilk = require(self.data.url('milk/Milk.js')),
		Account = new require(self.data.url('account.js')),
		Tasks = new require(self.data.url('tasks.js')),
		Events = require(self.data.url('events.js')),
		milkAuth = require(self.data.url('milk/MilkAuth.js')),
		// ContectMenu = require(self.data.url('contextMenu.js')),
		data = JSON.parse(self.data.load('data.json'));

	let events = new Events();
	let milk = new RememberTheMilk(data, events, 'write');

	// new ContectMenu(events);

	browser.browserAction.onClicked.addListener((tab) => {
	  console.log(tab.url);
		events.do('go.mooLater')
	});

	browser.browserAction.setPopup({popup: browser.extension.getURL("views/login/login.html")})

	let tasks = new Tasks(milk, button, events);
	let account = new Account(milk, button);

	events.on('go.mooLater', () => {
		let showing = account.isShowing() || tasks.isShowing();
//		console.log(`Showing: ${showing}`);
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
			milkAuth.checkToken(milk).then(() => {
				events.do('token.init');
			});
		}
	}());

}());
