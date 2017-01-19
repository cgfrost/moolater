(function () {
	'use strict';

	let lastCalled = '';

	let result = {};

	let succeed = true;

	let hasFrob = true;

	module.exports = function () {

		// Stubbed methods

		this.get = function (method, params, complete, error) {
			console.log(`Get called with method '${method}' and params '${params}'`);
			lastCalled = method;
			if (succeed) {
				complete(result);
			} else {
				error(result);
			}
		};

		this.hasFrob = function () {
			return hasFrob;
		};

		// Helper methods

		this.getLastMethodCalled = function () {
			return lastCalled;
		};

		this.setMethodReturn = function (newResult) {
			result = newResult;
		};

		this.setSucceed = function (newSucceed) {
			succeed = newSucceed;
		};

		this.setHasFrob = function (setHasFrob) {
			hasFrob = setHasFrob;
		};

	};

}());
