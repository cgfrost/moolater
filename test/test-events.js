(function () {
	"use strict";

	let test = require("sdk/test");
	let setTimeout = require("sdk/timers").setTimeout;
	let {
		before, after
	} = require('sdk/test/utils');
	let events = require("../data/events.js");

	exports["test register a listener"] = function (assert) {
		events.on("dummy.event", function () {});
		assert.strictEqual(events.numberOfEvents(), 1, "One listener registered.");
	};

	exports["test sending an event"] = function (assert, done) {
		events.on("dummy.event", function (sender) {
			assert.strictEqual("world", sender.hello, "Listener callback called.");
			done();
		});
		events.do("dummy.event", {
			hello: "world"
		});
	};

	exports["test sending a different event"] = function (assert, done) {
		events.on("dummy.event", function () {
			assert.fail("Listener callback called.");
			done();
		});
		events.do("different.event", {
			hello: "world"
		});
		setTimeout(function () {
			assert.pass("Bad callback not called after 1 second.");
			done();
		}, 1000);

	};

	exports["test unregistering a listener"] = function (assert) {
		var callback = function () {};
		events.on("dummy.event", callback);
		assert.strictEqual(events.numberOfEvents(), 1, "One listener registered.");
		assert.strictEqual(events.off("dummy.event", callback), true, "Listener deleted");
		assert.strictEqual(events.numberOfEvents(), 0, "No listeners registered.");
	};

	exports["test unregistering non-event is false"] = function (assert) {
		events.on("dummy.event", () => {});
		assert.strictEqual(events.numberOfEvents(), 1, "One listener registered.");
		assert.strictEqual(events.off("other.event", () => {}), false, "Listener deleted");
		assert.strictEqual(events.numberOfEvents(), 1, "One listener registered.");
	};

	before(exports, function (name) {
		console.log("================================================================================");
		console.log(`Running: ${name}`);
		events.reset();
	});

	after(exports, function (name) {
		console.log(`Finished: ${name}`);
		console.log("================================================================================");
	});

	test.run(exports);

}());
