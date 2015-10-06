(function () {
	'use strict';

	let subs = new Map();

	module.exports = function () {

		/*
		 * Send an event to any subscribed listeners
		 *
		 * @param eventName - event name to call
		 * @param message - a message for the listener
		 * @return
		 */
		this.do = function (eventName, message) {
			if (subs.has(eventName)) {
				subs.get(eventName).forEach(listener => {
					listener(eventName, message);
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
		this.on = function (eventName, listener) {
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
		this.off = function (eventName, callback) {
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
		this.numberOfEvents = function () {
			return subs.size;
		};

		/*
		 * Removed all listeners and returns how many were removed.
		 *
		 */
		this.reset = function () {
			var count = subs.size;
			subs = new Map();
			return count;
		};

	};

}());
