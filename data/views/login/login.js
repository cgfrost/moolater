/* global addon:false, document:false */

(function () {
    "use strict";

    var submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", () => {
        addon.port.emit("do-login");
    });

}());
