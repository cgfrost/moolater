(function () {
	'use strict';

	module.exports = function (milk, button, events) {

		let tabs = require('sdk/tabs'),
			self = require('sdk/self'),
			preferences = require('sdk/simple-prefs').prefs,
			Panel = require('sdk/panel').Panel,
			milkTasks = require(self.data.url('milk/MilkTasks.js')),
			setTimeout = require('sdk/timers').setTimeout,
			selection,
			me = this;

		try {
			selection = require('sdk/selection');
		} catch (e) {
			console.error(`Selection MultiProcess Error: '${e}' - See: https://bugzilla.mozilla.org/show_bug.cgi?id=1060695`);
			selection = {
				text: undefined
			};
		}

		me.lists = [];

		let addTaskPanel = new Panel({
			contentURL: self.data.url('views/add/addTask.html'),
			position: button,
			width: 350,
			height: 340,
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
			addTaskPanel.port.emit('update-add-list');
			if (selection.text) {
				addTaskPanel.port.emit('show-use-selected-text', me.getSelectedText());
				addTaskPanel.resize(350, 375);
			} else {
				addTaskPanel.port.emit('hide-use-selected-text');
				addTaskPanel.resize(350, 340);
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
			addTaskPanel.resize(350, 340);
			milkTasks.addTask(milk, name, listId)
				.then((resp) => {
					let task = resp.rsp.list;
					let addLinkPromise = link === '' ? true : milkTasks.addUrlToTask(milk, task, link);
					let addNotePromise = useSelection ? milkTasks.addNoteToTask(milk, task, 'Selected Text', selection) : true;
					Promise.all([addLinkPromise, addNotePromise])
						.then(() => {
							me.flashState(task.taskseries.name, 'done');
						}).catch((reason) => {
							me.flashState(reason, 'error');
						});
				}).catch((reason) => {
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
			milkTasks.getLists(milk).then((resp) => {
				me.lists = resp.rsp.lists.list;
				if (addTaskPanel.isShowing) {
					addTaskPanel.port.emit('update-lists', me.lists, me.getDefaultList());
					addTaskPanel.port.emit('set-refresh-button-icon', 'done');
					setTimeout(() => {
						addTaskPanel.port.emit('set-refresh-button-icon', 'refresh');
					}, 1000);
				}
			}).catch(() => {
				if (addTaskPanel.isShowing) {
					addTaskPanel.port.emit('set-refresh-button-icon', 'error');
					setTimeout(() => {
						addTaskPanel.port.emit('set-refresh-button-icon', 'refresh');
					}, 1000);
				}
			});
		};

		addTaskPanel.port.on('add-list', (listName) => {
			if (addTaskPanel.isShowing) {
				addTaskPanel.port.emit('set-add-list-status', 'loading');
			}
			milkTasks.addList(milk, listName).then((resp) => {
				me.lists.push(resp.rsp.list);
				if (addTaskPanel.isShowing) {
					addTaskPanel.port.emit('update-lists', me.lists, resp.rsp.list.name);
					addTaskPanel.port.emit('set-add-list-status', 'done');
					setTimeout(() => {
						addTaskPanel.port.emit('set-add-list-status', 'blank');
						addTaskPanel.port.emit('hide-add-list', 'blank');
					}, 1000);
				}
			}).catch((reason) => {
				if (addTaskPanel.isShowing) {
					addTaskPanel.port.emit('set-add-list-status', 'error');
					addTaskPanel.port.emit('set-add-list-msg', reason);
					addTaskPanel.port.emit('set-add-list-buttons');
					setTimeout(() => {
						addTaskPanel.port.emit('set-add-list-status', 'blank');
					}, 1000);
				}
			});
		});

		this.getDefaultList = () => {
			let defaultList = preferences['extensions.moolater.defaultList'];
			if (defaultList === null || defaultList === '') {
				defaultList = 'Inbox';
			}
			return defaultList;
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
