(function () {
	'use strict';

	let test = require('sdk/test');
	let {
		before, after
	} = require('sdk/test/utils');
	let events = require('../data/events.js');
	let Milk = require('./stub-milk.js');
	let	ToggleButton = require('sdk/ui').ToggleButton;
	let	Account = new require('../data/account.js');
	let stubMilk = new Milk();

	let button = new ToggleButton({
		id: 'test-moolater-toggle-account',
		label: 'Save to milk',
		icon: './logo/icon-32.png'
	});

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
