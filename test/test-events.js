(function () {
	"use strict";

	let test = require("sdk/test");
	let {
		before, after
	} = require('sdk/test/utils');
	let events = require("../data/events.js");

	exports["test register a listener"] = function (assert) {
		events.on("dummy.event", function () {});
		assert.strictEqual(events.numberOfListeners(), 1, "One listener registered.");
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
		done();
	};

	exports["test unregistering a listener"] = function (assert) {
		var callback = function () {};
		events.on("dummy.event", callback);
		assert.strictEqual(events.numberOfListeners(), 1, "One listener registered.");
		events.off("dummy.event", callback);
		assert.strictEqual(events.numberOfListeners(), 0, "No listeners registered.");
	};

	before(exports, function (name) {
		console.log("Running test: " + name);
		events.clearListeners();
	});

	after(exports, function (name) {
		console.log("Finished test: " + name);
	});

	test.run(exports, function (result) {
		console.log('Passed: ', result.passes.length);
		console.log('Failed: ', result.fails.length);
		console.log('Errors: ', result.errors.length);
	});

}());