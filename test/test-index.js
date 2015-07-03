"use strict";

var main = require("../");

exports["test main"] = function (assert) {
    assert.pass("Unit test running!");
};

exports["test main async"] = function (assert, done) {
    assert.pass("async Unit test running!");
    done();
};

//exports["test dummy"] = function (assert, done) {
//    var state = {checked: true};
//    main.handleToggle(state);
//};

require("sdk/test").run(exports);
