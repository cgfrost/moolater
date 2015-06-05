var self = require('sdk/self');

// a dummy function, to show how tests work, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}
exports.dummy = dummy;

// Buttons

var ui = require("sdk/ui");
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");

var button = ui.ToggleButton({
    id: "moolater-link",
    label: "Save to RTM",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onChange: function(state) {
        var activeWindowTitle = tabs.activeTab.title;
        var activeWindowUrl = tabs.activeTab.url;
        console.log(state.label + " checked state: " + state.checked);
        console.log("Active window title is: " + activeWindowTitle);
        console.log("Active window url is: " + activeWindowUrl);
        handleChange(state)
    }
});

var panel = panels.Panel({
    contentURL: self.data.url("addTask.html"),
    contentScriptFile: self.data.url("addTask.js"),
    onHide: handleHide,
    onShow: handleShow
});

panel.port.on("save-task", function (text) {
  console.log("BOOM" + text);
});

function handleShow() {
    var activeWindowTitle = tabs.activeTab.title;
    var activeWindowUrl = tabs.activeTab.url;
    panel.port.emit("show", activeWindowTitle, activeWindowUrl);
}

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {checked: false});
}