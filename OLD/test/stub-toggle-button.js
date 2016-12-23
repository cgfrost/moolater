(function () {
	'use strict';

	let ToggleButton = require('sdk/ui').ToggleButton;
	
	module.exports = function (id) {

		return new ToggleButton({
			id: id,
			label: 'Save to milk',
			icon: './logo/icon-32.png'
		});

	};

}());