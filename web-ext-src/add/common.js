/* global addon:false, document:false, window:false */

(function () {
	'use strict';

	var contentElement = document.getElementById('content');
	var status = document.getElementById('status');
	var statusMsg = document.getElementById('status-msg');
	var statusImg = document.getElementById('status-img');

	var util = {};

	addon.port.on('set-state', (clear, message, iconName) => {
		if (clear) {
			contentElement.classList.remove('hide');
			status.classList.add('hide');
		} else {
			util.setTextElement(statusMsg, message);
			util.setIconState(statusImg, iconName);
			contentElement.classList.add('hide');
			status.classList.remove('hide');
		}
	});

	util.setIconState = (icon, iconName) => {
		icon.setAttribute('src', '../icons/' + iconName + '.svg');
	};

	util.setTextElement = (label, text) => {
		var firstTextElement;
		var children = label.childNodes;
		for (var i = 0; i < children.length; i++) {
			if (children[i].nodeName === '#text') {
				firstTextElement = children[i];
				break;
			}
		}
		if (firstTextElement) {
			label.replaceChild(document.createTextNode(text), firstTextElement);
		} else {
			label.appendChild(document.createTextNode(text));
		}
	};

	window.util = util;

}());
