(function () {
    "use strict";

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
        RtmLib = require(self.data.url("rtm.js"));

    var keys = JSON.parse(self.data.load("keys.json"));
    var apiKey = keys.api_key;

    var apiSecret = keys.shared_secret;
    var loggedIn = false;

    var rtm = new RtmLib(apiKey, apiSecret, "write");

    var button = new ui.ToggleButton({
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

    var loginPanel = new panels.Panel({
        contentURL: self.data.url("login/login.html"),
        contentScriptFile: self.data.url("login/login.js"),
        onHide: handleHide
    });

    var settingsPanel = new panels.Panel({
        contentURL: self.data.url("settings/settings.html"),
        contentScriptFile: self.data.url("settings/settings.js"),
        onHide: handleHide
    });

    var addTaskPanel = new panels.Panel({
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
        button.state("window", {
            checked: false
        });
    }

    addTaskPanel.port.on("save-task", function (text) {
        console.log("Port.on(save-task): " + text);
    });

    loginPanel.port.on("do-login", function (id, password) {
        console.log("Port.on(do-login): " + id + ":" + password);
    });

    exports.dummy = dummy;

}());
