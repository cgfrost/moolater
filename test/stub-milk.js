(function () {
	'use strict';

	module.exports = function (fail) {
		
		/**
		 * Main method for making API calls
		 *
		 * @param method    Specifies what API method to be used
		 * @param params    Array of API parameters to accompany the method parameter
		 * @param complete  Callback to fire after the request comes back
		 * @param error     (Optional) Callback to fire if the request fails
		 * @return          Returns the reponse from the milk API
		 */
		this.get = function (method, params, complete, error) {
			console.log(`Get called with method '${method}' and params '${params}'`);
			if(fail){
				error('Fail requested');
			}else{
				complete('Sucsess requested');
			}
		};
		
	};
	
}());