(function () {
	'use strict';

	let test = require('sdk/test');
	let {
		before, after
	} = require('sdk/test/utils');
	let events = require('../data/events.js');
	let Milk = require('./stub-milk.js');
	let	ToggleButton = require('sdk/ui').ToggleButton;
	let	Tasks = new require('../data/tasks.js');
	let stubMilk = new Milk(false);

	let button = new ToggleButton({
		id: 'test-moolater-toggle-tasks',
		label: 'Save to milk',
		icon: './logo/icon-32.png'
	});

	exports['test auth url'] = function (assert) {
		let tasks = new Tasks(stubMilk, button, events);
		assert.strictEqual('Read Later', tasks.getDefaultList(), 'Wrong default list returned.');
	};

	before(exports, function (name) {
		console.log('================================================================================');
		console.log(`Running tasks: ${name}`);
	});

	after(exports, function (name) {
		console.log(`Finished tasks: ${name}`);
		console.log('================================================================================');
	});

	test.run(exports);

}());
