/* global addon:false, document:false */

(function () {
    "use strict";

    var submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", function click() {
        addon.port.emit("do-login");
    });

}());
