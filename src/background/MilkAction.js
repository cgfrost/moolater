class MilkAction {

	getToken(milk) {
		return new Promise((resolve, reject) => {
			milk.get('rtm.auth.getToken', {},
				resolve,
				reject);
		});
	}

	checkToken(milk) {
		return new Promise((resolve, reject) => {
			milk.get('rtm.auth.checkToken', {},
				resolve,
				reject);
		});
	}

	getFrob(milk) {
		return new Promise((resolve, reject) => {
			milk.get('rtm.auth.getFrob', {},
				resolve,
				reject);
		});
	}

	createTimeline(milk) {
		return new Promise((resolve, reject) => {
			milk.get('rtm.timelines.create', {},
				resolve,
				reject);
		});
	}

    addTask(milk, name, listId) {
        return new Promise((resolve, reject) => {
            browser.storage.local.get('useSmartAdd').then((useSmartAdd) => {
                milk.get('rtm.tasks.add', {
                             list_id: listId,
                             name: name,
                             timeline: milk.timeline,
                             parse: useSmartAdd ? 1 : 0
                         },
                         resolve,
                         reject);
            });
        });
    }

    addUrlToTask(milk, task, link) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.tasks.setURL', {
                         list_id: task.id,
                         taskseries_id: task.taskseries.id,
                         task_id: task.taskseries.task.id,
                         url: link,
                         timeline: milk.timeline
                     },
                     resolve,
                     reject);
        });
    }

    addNoteToTask(milk, task, title, text) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.tasks.notes.add', {
                         list_id: task.id,
                         taskseries_id: task.taskseries.id,
                         task_id: task.taskseries.task.id,
                         timeline: milk.timeline,
                         note_title: title,
                         note_text: text
                     },
                     resolve,
                     reject);
        });
    }

    getLists(milk) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.lists.getList', {},
                     resolve,
                     reject);
        });
    }

    addList(milk, name) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.lists.add', {
                         name: name,
                         timeline: milk.timeline
                     },
                     resolve,
                     reject);
        });
    }
}

