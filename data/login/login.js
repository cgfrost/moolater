/* global self:false, document:false */

(function () {
    "use strict";

    // When the user hits return, send the "text-entered"
    // message to main.js.
    // The message payload is the contents of the edit box.

    var submitButton = document.getElementById("submit");
    var idField = document.getElementById("id");
    var passwordField = document.getElementById("password");
    submitButton.addEventListener("click", function click() {
        self.port.emit("do-login", idField.value, passwordField.value);
    });

    //textArea.addEventListener('keyup', function onkeyup(event) {
    //  if (event.keyCode == 13) {
    //    // Remove the newline.
    //    text = textArea.value.replace(/(\r\n|\n|\r)/gm,"");
    //    self.port.emit("save-task", text);
    //    textArea.value = '';
    //  }
    //}, false);

    // Listen for the "show" event being sent from the
    // main add-on code. It means that the panel's about
    // to be shown.
    //
    // Set the focus to the text area so the user can
    // just start typing.

    self.port.on("login-failed", function onShow(title) {
        //    textArea.value = "Title" + title + "URL " + url;
        //    textArea.focus();
        console.log("msg-recieved: show-login" + title);
    });

}());
