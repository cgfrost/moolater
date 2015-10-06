(function () {
	'use strict';

	module.exports = function (events) {

		let selection = require('sdk/selection');
		let contextMenu = require('sdk/context-menu');
		let script = 'self.on("click", () => {self.postMessage();});';

		new contextMenu.Item({
			label: 'Moo Later - Add task',
			contentScript: script,
			data: 'Add task',
			onMessage: () => {
				events.do('go.mooLater');
			}
		});

		new contextMenu.Item({
			label: 'Moo Later - Add task with selection',
			context: contextMenu.SelectionContext(),
			contentScript: script,
			data: 'Add task with selection',
			onMessage: () => {
				let selectedText;
				if (selection.isContiguous) {
					selectedText = `"${selection.text}"`;
				} else {
					for (var subselection in selection) {
						if (selectedText) {
							selectedText = selectedText.concat(`, "${subselection.text}"`);
						} else {
							selectedText = `"${subselection.text}"`;
						}
					}
				}
				events.do('go.mooLater', selectedText);
			}
		});

	};

}());
