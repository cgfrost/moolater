class MilkAction {

    addTask(milk, debug, name, listId) {
        return new Promise((resolve, reject) => {
            browser.storage.local.get('useSmartAdd').then((useSmartAdd) => {
                milk.get('rtm.tasks.add', debug, {
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

    addUrlToTask(milk, debug, task, link) {

        let taskseries = task.taskseries.id ? task.taskseries : task.taskseries[0];
        let task_id = taskseries.task.id ? taskseries.task.id : taskseries.task[0].id;

        return new Promise((resolve, reject) => {
            milk.get('rtm.tasks.setURL', debug, {
                         list_id: task.id,
                         taskseries_id: taskseries.id,
                         task_id: task_id,
                         url: link,
                         timeline: milk.timeline
                     },
                     resolve,
                     reject);
        });
    }

    addNoteToTask(milk, debug, task, title, text) {
        return new Promise((resolve, reject) => {

            let taskseries = task.taskseries.id ? task.taskseries : task.taskseries[0];
            let task_id = taskseries.task.id ? taskseries.task.id : taskseries.task[0].id;

            milk.get('rtm.tasks.notes.add', debug, {
                         list_id: task.id,
                         taskseries_id: taskseries.id,
                         task_id: task_id,
                         timeline: milk.timeline,
                         note_title: title,
                         note_text: text
                     },
                     resolve,
                     reject);
        });
    }

    getLists(milk, debug) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.lists.getList', debug, {},
                     resolve,
                     reject);
        });
    }

    addList(milk, debug, name) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.lists.add', debug, {
                         name: name,
                         timeline: milk.timeline
                     },
                     resolve,
                     reject);
        });
    }
}

