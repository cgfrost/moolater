(function () {
	"use strict";

	//	module.exports = function () {

	let subs = new Map();

	/*
	 * Send an event to any subscribed listeners
	 *
	 * @param eventName
	 * @param callback
	 * @return
	 */
	module.exports.do = function (eventName, sender) {
		if (subs.has(eventName)) {
			subs.get(eventName).forEach(listener => {
				listener(sender);
			});
		}
	};

	/*
	 * Register a listener for the given event name
	 *
	 * @param eventName
	 * @param callback
	 * @return
	 */
	module.exports.on = function (eventName, listener) {
		if (subs.has(eventName)) {
			subs.get(eventName).add(listener);
		} else {
			subs.set(eventName, new Set().add(listener));
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
		if (subs.has(eventName)) {
			subs.get(eventName).delete(callback);
			if (subs.get(eventName).size === 0) {
				subs.delete(eventName);
			}
			return true;
		}
		return false;
	};

	/*
	 * Returns the number of registerd listeners.
	 *
	 */
	module.exports.numberOfEvents = function () {
		return subs.size;
	};

	/*
	 * Removed all listeners and returns how many were removed.
	 *
	 */
	module.exports.reset = function () {
		var count = subs.size;
		subs = new Map();
		return count;
	};

	//	};

}());
