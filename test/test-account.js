(function () {
	'use strict';

	let test = require('sdk/test');
	let {
		before, after
	} = require('sdk/test/utils');

	let Events = require('../data/events.js');
	let Milk = require('./stub-milk.js');
	let Account = new require('../data/account.js');
	let stubButtonFactory = require('./stub-toggle-button.js');

	let setTimeout = require('sdk/timers').setTimeout;
	let events = new Events();
	let stubMilk = new Milk();
	let button = stubButtonFactory('test-moolater-toggle-account');

	exports['test showLogin'] = function (assert, done) {
		let account = new Account(stubMilk, button, events);
		account.showLogin();
		setTimeout(() => {
			assert.strictEqual(true, account.isShowing(), 'Login panel not displayed.');
			done();
		}, 1000);
	};

	exports['test isReady'] = function (assert) {
		let account = new Account(stubMilk, button, events);
		assert.strictEqual(false, account.isReady(), 'Returned account ready when no credentials have been stored.');
	};

	before(exports, function (name) {
		console.log('================================================================================');
		console.log(`Running account: ${name}`);
	});

	after(exports, function (name) {
		console.log(`Finished account: ${name}`);
		console.log('================================================================================');
	});

	test.run(exports);

}());
