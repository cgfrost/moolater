/*jslint node: true */
'use strict';

var ui = require("sdk/ui");
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");

// a dummy function, to show how tests work, look at test/test-index.js
function dummy(text, callback) {
    callback(text);
}
exports.dummy = dummy;

var button = ui.ToggleButton({
    id: "moolater-link",
    label: "Save to RTM",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onChange: function (state) {
        console.log(state.label + " checked state: " + state.checked);
        console.log("Active window title is: " + tabs.activeTab.title);
        console.log("Active window url is: " + tabs.activeTab.url);
        handleToggle(state);
    }
});

var loggedIn = false;

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
    onShow: sendPageDetails
});

addTaskPanel.port.on("save-task", function (text) {
    console.log("BOOM" + text);
});

loginPanel.port.on("do-login", function (id, password) {
    console.log("Port.on: " + id + ':' + password);
});

function handleToggle(state) {
    if (state.checked) {
        if (loggedIn) {
            addTaskPanel.show({position: button});
        } else {
            loginPanel.show({position: button});
        }
    }
}

function sendPageDetails() {
    addTaskPanel.port.emit("update-page-details", tabs.activeTab.title, tabs.activeTab.url);
}

function handleHide() {
    button.state('window', {checked: false});
}


exports.dummy = dummy;
exports.handleToggle = handleToggle;

