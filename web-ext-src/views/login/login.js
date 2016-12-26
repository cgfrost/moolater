/* global addon:false, document:false, window:false */

(function () {
	'use strict';

	var submitButton = document.getElementById('submit-permission');
	var util = window.util;

	submitButton.addEventListener('click', () => {
		addon.port.emit('do-login');
	}, false);

	addon.port.on('set-button-state', (disabled) => {
		submitButton.disabled = disabled;
		var message = disabled ? 'Checking' : 'Allow access' ;
		util.setTextElement(submitButton, message);
		submitButton.focus();
	});

}());
