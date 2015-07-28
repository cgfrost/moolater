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
        RememberTheMilk = require(self.data.url("rtm.js"));

    var keys = JSON.parse(self.data.load("keys.json"));
    var apiKey = keys.api_key;
    var apiSecret = keys.shared_secret;
    var loggedIn = false;

    var rtm = new RememberTheMilk(apiKey, apiSecret, "write", "json");

    var button = new ui.ToggleButton({
        id: "moolater-link",
        label: "Save to RTM",
        icon: {
            "18": "./icon-18.png",
            "32": "./icon-32.png",
            "36": "./icon-36.png",
            "64": "./icon-64.png",
            "128": "./icon-128.png"
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
        rtm.get('rtm.auth.getFrob', {}, function(resp){
			var frob = resp.rsp.frob;
			var authUrl = rtm.getAuthUrl(frob);
			console.log("authUrl: " + authUrl);

			rtm.get('rtm.auth.getToken', {frob: frob}, function(resp){
				rtm.setAuthToken(resp.rsp.auth.token);
				console.log("token: " + resp);
			});

		});
    });

    exports.dummy = dummy;

}());
