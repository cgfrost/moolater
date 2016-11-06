(function () {
	'use strict';

	module.exports = function (events) {

		let contextMenu = require('sdk/context-menu'),
			preferences = require('sdk/simple-prefs'),
			script = 'self.on("click", () => {self.postMessage();});',
			me = this,
			menuItem;

		this.getMenuItem = () => {
			return new contextMenu.Item({
				label: 'Moo Later',
				contentScript: script,
				onMessage: () => {
					events.do('go.mooLater');
				}
			});
		};

		if (preferences.prefs['extensions.moolater.showContextMenu']) {
			menuItem = me.getMenuItem();
		}

		preferences.on('extensions.moolater.showContextMenu', () => {
			if (preferences.prefs['extensions.moolater.showContextMenu']) {
				if (menuItem) {
					menuItem.destroy();
				}
				menuItem = me.getMenuItem();
			} else {
				menuItem.destroy();
				menuItem = undefined;
			}
		});

	};

}());
