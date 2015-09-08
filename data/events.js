(function () {
	"use strict";

//	module.exports = function () {

		let subs = {};

		/*
		 * Send an event to any subscribed listeners
		 *
		 * @param eventName
		 * @param callback
		 * @return
		 */
		module.exports.do = function (eventName, sender) {
			if (subs[eventName]) {
				for (var i = 0; i < subs[eventName].length; i++) {
					subs[eventName][i](sender);
				}
			}
		};

		/*
		 * Register a listener for the given event name
		 *
		 * @param eventName
		 * @param callback
		 * @return
		 */
		module.exports.on = function (eventName, callback) {
			if (subs[eventName]) {
				subs[eventName].push(callback);
			} else {
				subs[eventName] = [callback];
			}
		};
		
		/*
		 * Unregister a listener for the given event name
		 *
		 * @param eventName
		 * @param callback
		 * @return
		 */
		module.exports.off = function (eventName, callback) {
			if (subs[eventName]) {
				let newCallbacks = [];
				for (var i = 0; i < subs[eventName].length; i++) {
					if(subs[eventName][i] !== callback) {
						newCallbacks.pop(subs[eventName][i]);
					}
				}
				subs[eventName] = newCallbacks;
				return true;
			}
			return false;
		};
		
		/*
		 * Returns the number of registerd listeners.
		 *
		 */
		module.exports.numberOfListeners = function () {
			return Object.keys(subs).length;	
		};
		
		/*
		 * Removed all listeners and returns how many were removed.
		 *
		 */
		module.exports.clearListeners = function () {
			var count = Object.keys(subs).length;	
			subs = {};
			return count;
		};
		
//	};

}());