(function () {
	'use strict';

	module.exports = function (milk, button, events) {

		let tabs = require('sdk/tabs'),
			self = require('sdk/self'),
			preferences = require('sdk/simple-prefs').prefs,
			Panel = require('sdk/panel').Panel,
			selection = require('sdk/selection'),
			milkTasks = require(self.data.url('milk/MilkTasks.js')),
			setTimeout = require('sdk/timers').setTimeout,
			me = this;

		me.lists = [];

		let addTaskPanel = new Panel({
			contentURL: self.data.url('views/add/addTask.html'),
			position: button,
			height: 310,
			width: 350,
			onHide: () => {
				button.state('window', {
					checked: false
				});
			}
		});

		this.showAddTask = () => {
			addTaskPanel.port.emit('set-state', true);
			let title = preferences['extensions.moolater.useTitle'] ? tabs.activeTab.title : '';
			let link = preferences['extensions.moolater.useLink'] ? tabs.activeTab.url : '';
			if (link === 'about:blank') {
				link = '';
			}
			addTaskPanel.port.emit('update-task', title, link);
			addTaskPanel.port.emit('update-lists', me.lists, me.getDefaultList());
			if (me.isTextSelected()) {
				addTaskPanel.port.emit('show-use-selected-text', me.getSelectedText());
				addTaskPanel.resize(350, 345);
			} else {
				addTaskPanel.port.emit('hide-use-selected-text');
				addTaskPanel.resize(350, 310);
			}
			addTaskPanel.show();
		};

		this.hide = () => {
			addTaskPanel.hide();
		};

		this.isShowing = () => {
			return addTaskPanel.isShowing;
		};

		addTaskPanel.port.on('add-task', (name, link, useSelection, selection, listId) => {
			addTaskPanel.port.emit('set-state', false, 'Adding Task', 'loading');
			milkTasks.addTask(milk, name, listId).then((resp) => {
				let task = resp.rsp.list;
				let addLinkPromise = link === '' ? true : milkTasks.addUrlToTask(milk, task, link);
				let addNotePromise = useSelection ? milkTasks.addNoteToTask(milk, task, 'Selected Text', selection) : true;
				Promise.all([addLinkPromise, addNotePromise]).then(() => {
					me.flashState(task.taskseries.name, 'done');
				}, (reason) => {
					me.flashState(reason, 'error');
				});
			}, (reason) => {
				me.flashState(reason, 'error');
			});
		});

		addTaskPanel.port.on('update-lists', () => {
			me.fetchLists();
		});

		this.flashState = (message, icon) => {
			addTaskPanel.port.emit('set-state', false, message, icon);
			setTimeout(() => {
				addTaskPanel.hide();
			}, 1200);
			setTimeout(() => {
				addTaskPanel.port.emit('set-state', true);
			}, 1300);
		};

		events.on('token.init', () => {
			me.fetchLists();
		});

		this.fetchLists = () => {
			if (addTaskPanel.isShowing) {
				addTaskPanel.port.emit('set-refresh-button-icon', 'loading');
			}
			milk.get('rtm.lists.getList', {}, (resp) => {
				me.lists = resp.rsp.lists.list;
				if (addTaskPanel.isShowing) {
					addTaskPanel.port.emit('update-lists', me.lists, me.getDefaultList());
					addTaskPanel.port.emit('set-refresh-button-icon', 'done');
					setTimeout(() => {
						addTaskPanel.port.emit('set-refresh-button-icon', 'refresh');
					}, 1000);
				}
			}, (fail) => {
				console.warn(fail);
				if (addTaskPanel.isShowing) {
					addTaskPanel.port.emit('set-refresh-button-icon', 'error');
					setTimeout(() => {
						addTaskPanel.port.emit('set-refresh-button-icon', 'refresh');
					}, 1000);
				}
			});
		};

		this.getDefaultList = () => {
			let defaultList = preferences['extensions.moolater.defaultList'];
			if (defaultList === null || defaultList === '') {
				defaultList = 'Inbox';
			}
			return defaultList;
		};

		this.isTextSelected = () => {
			if (selection.text) {
				return true;
			} else {
				return false;
			}
		};

		this.getSelectedText = () => {
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
			return selectedText;
		};

	};

}());
