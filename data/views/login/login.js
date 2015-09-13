/* global addon:false, document:false */

(function () {
    "use strict";

    var submitButton = document.getElementById("submit");

	var contentElement = document.getElementById("content");

	var status = document.getElementById("status");
	var statusMsg = document.getElementById("status-msg");
	var statusImg = document.getElementById("status-img");

    submitButton.addEventListener("click", () => {
        addon.port.emit("do-login");
    });

	addon.port.on("set-state", (clear, message, iconName) => {
		if (clear) {
			contentElement.classList.remove("hide");
			status.classList.add("hide");
		} else {
			setTextElement(statusMsg, message);
			setIconState(statusImg, iconName);
			contentElement.classList.add("hide");
			status.classList.remove("hide");
		}
	addon.port.on("set-button-state", (disabled) => {
		submitButton.disabled = disabled;
		var message = disabled ? 'Checking' : 'Allow access' ;
		util.setTextElement(submitButton, message);
	});

	var setIconState = (icon, iconName) => {
		icon.setAttribute("src", "../icons/" + iconName + ".svg");
	};

	var setTextElement = (textElement, text) =>{
		while (textElement.firstChild) {
			textElement.removeChild(textElement.firstChild);
		}
		textElement.appendChild(document.createTextNode(text));
	};

}());
