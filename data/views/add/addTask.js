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
//            taskElement.value = "";
        }
    }, false);

    self.port.on("update-page-details", function fooBar(title, url) {
        console.log("Active window title is: '" + title + "' url is: '" + url + "'");
        taskElement.value = title;
        linkElement.value = url;
        taskElement.focus();
    });
}());
