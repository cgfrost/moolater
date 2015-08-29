/* global self:false, document:false */

(function () {
    "use strict";

    var taskElement = document.getElementById("task");
    var linkElement = document.getElementById("link");
    taskElement.addEventListener("keyup", function onkeyup(event) {
        if (event.keyCode === 13) {
			linkElement.focus();
        }
    }, false);
    linkElement.addEventListener("keyup", function onkeyup(event) {
        if (event.keyCode === 13) {
            self.port.emit("save-task", taskElement.value, linkElement.value);
            taskElement.value = "";
            linkElement.value = "";
        }
    }, false);

    self.port.on("update-page-details", function (title, url) {
        console.log("Active window title is: '" + title + "' url is: '" + url + "'");
        taskElement.value = title;
        linkElement.value = url;
        taskElement.focus();
    });

    self.port.on("task-saved", function (title) {
        taskElement.value = "Task Saved: " + title;
    });

    self.port.on("task-save-error", function (error, description) {
        taskElement.value = "Error: " + error;
        linkElement.value = "Description: " + description;
    });

}());
