(function () {
	'use strict';

	let test = require('sdk/test');
	let {
		before, after
	} = require('sdk/test/utils');
	let md5 = require('../data/md5.js');

	exports['test hashing a simple string'] = function (assert) {
		assert.strictEqual(`FOO${md5('simple string')}`, 'FOObec0124123e5ab4c2ce362461cb46ff0', 'Bad hash generated.');
	};

	exports['test hashing a harder string'] = function (assert) {
		assert.strictEqual(`FOO${md5('harder string :%"')}`, 'FOO7582706eff976e8f64b5d8a0b6a388d8', 'Bad hash generated.');
	};

	exports['test hashing a multi byte char'] = function (assert) {
		assert.strictEqual(`FOO${md5('multi byte chars |–£')}`, 'FOO75f71999196ad059252f484bf52577fc', 'Bad hash generated.');
	};

	before(exports, function (name) {
		console.log('================================================================================');
		console.log(`Running md5: ${name}`);
	});

	after(exports, function (name) {
		console.log(`Finished md5: ${name}`);
		console.log('================================================================================');
	});

	test.run(exports);

}());
