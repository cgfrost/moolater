(function () {
	'use strict';

	let test = require('sdk/test');
	let {
		before, after
	} = require('sdk/test/utils');
	let events = require("../data/events.js");
	let RememberTheMilk = require('../data/rtm');

	exports['test auth url'] = function (assert) {
		let rtm = new RememberTheMilk('key', 'secret', events, 'write');
		let expectedAuthUrl = 'https://www.rememberthemilk.com/services/auth/?api_key=key&perms=write&frob=FOOBAR&format=json&api_sig=56c0c8efe2714fefa886349f56447414';
		rtm.setFrob('FOOBAR');
		assert.strictEqual(rtm.getAuthUrl(), expectedAuthUrl, 'Bad authUrl returned.');
	};
	
	before(exports, function (name) {
		console.log('================================================================================');
		console.log(`Running rtm: ${name}`);
	});

	after(exports, function (name) {
		console.log(`Finished rtm: ${name}`);
		console.log('================================================================================');
	});

	test.run(exports);

}());