(function () {
	'use strict';

	module.exports = function () {

		let lastCalled = '';

		let result = {};

		let succeed = true;

		// Stubbed methods

		this.get = function (method, params, complete, error) {
			console.log(`Get called with method '${method}' and params '${params}'`);
			lastCalled = method;
			if(succeed){
				complete(result);
			}else{
				error(result);
			}
		};
		
		// Helper methods

		this.getLastMethodCalled = function(){
			return lastCalled;
		};

		this.setMethodReturn = function(newResult){
			result = newResult;
		};

		this.setSucceed = function(newSucceed) {
			succeed = newSucceed;
		};

	};
	
}());
