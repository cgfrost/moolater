/*jslint node: true */

(function () {
    'use strict';

    // a dummy function, to show how tests work, look at test/test-index.js
    function dummy(text, callback) {
        callback(text);
    }
    exports.dummy = dummy;

    var ui = require("sdk/ui"),
        panels = require("sdk/panel"),
        self = require("sdk/self"),
        tabs = require("sdk/tabs"),
        base64 = require("sdk/base64"),
        credentials = require("sdk/passwords"),
        RTM_lib = require(self.data.url("rtm.js"));

    var keys = JSON.parse(self.data.load("keys.json"));
    var api_key = keys.api_key;
    var api_secret = keys.shared_secret;
    var loggedIn = false;

    var rtm = new RTM_lib(api_key, api_secret, '');

    var button = ui.ToggleButton({
        id: "moolater-link",
        label: "Save to RTM",
        icon: {
            "16": "./icon-2-16.png",
            "32": "./icon-2-32.png",
            "64": "./icon-2-64.png"
        },
        onChange: function (state) {
            handletoggle(state);
        }
    });

    var loginPanel = panels.Panel({
        contentURL: self.data.url("login/login.html"),
        contentScriptFile: self.data.url("login/login.js"),
        onHide: handleHide
    });

    var settingsPanel = panels.Panel({
        contentURL: self.data.url("settings/settings.html"),
        contentScriptFile: self.data.url("settings/settings.js"),
        onHide: handleHide
    });

    var addTaskPanel = panels.Panel({
        contentURL: self.data.url("add/addTask.html"),
        contentScriptFile: self.data.url("add/addTask.js"),
        onHide: handleHide,
        onShow: function sendPageDetails() {
            addTaskPanel.port.emit("update-page-details", tabs.activeTab.title, tabs.activeTab.url);
        }
    });

    function handletoggle(state) {
        console.log("Handle toggle: " + state.label + " checked state: " + state.checked);
        if (state.checked) {
            if (loggedIn) {
                addTaskPanel.show({
                    position: button
                });
            } else {
                loginPanel.show({
                    position: button
                });
            }
        }
    }

    function handleHide() {
        button.state('window', {
            checked: false
        });
    }

    addTaskPanel.port.on("save-task", function (text) {
        console.log("Port.on(save-task): " + text);
    });

    loginPanel.port.on("do-login", function (id, password) {
        console.log("Port.on(do-login): " + id + ':' + password);
    });

    exports.dummy = dummy;

}());
