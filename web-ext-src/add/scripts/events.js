(function () {
	'use strict';

	let subs = new Map();

	var events = {};

		/*
		 * Send an event to any subscribed listeners
		 *
		 * @param eventName - event name to call
		 * @return
		 */
		events.do = function (eventName) {
			console.log("Event called: " + eventName);
			if (subs.has(eventName)) {
				subs.get(eventName).forEach(listener => {
					listener(eventName);
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
		events.on = function (eventName, listener) {
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
		events.off = function (eventName, callback) {
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
		events.numberOfEvents = function () {
			return subs.size;
		};

		/*
		 * Removed all listeners and returns how many were removed.
		 *
		 */
		events.reset = function () {
			var count = subs.size;
			subs = new Map();
			return count;
		};

		ml.events = events;

}());
