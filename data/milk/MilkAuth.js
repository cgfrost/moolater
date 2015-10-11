(function () {
	'use strict';
	
	module.exports = {	
		
		getToken: (milk) => {
			return new Promise((resolve, reject) => {
				milk.get('rtm.auth.getToken', {},
					resolve,
					reject);
			});
		},
		
		createTimeline: (milk) => {
			return new Promise((resolve, reject) => {
				milk.get('rtm.timelines.create', {},
					resolve,
					reject);
			});
		}
		
	};
	
}());