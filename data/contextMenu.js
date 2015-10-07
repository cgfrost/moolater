(function () {
	'use strict';

	module.exports = function (events) {

		let contextMenu = require('sdk/context-menu');
		let script = 'self.on("click", () => {self.postMessage();});';

		new contextMenu.Item({
			label: 'Moo Later',
			contentScript: script,
			onMessage: () => {
				events.do('go.mooLater');
			}
		});

	};

}());
