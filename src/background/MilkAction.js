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

    addUrlToTask(milk, debug, list, link) {
        return new Promise((resolve, reject) => {
            let taskseries = list.taskseries.id ? list.taskseries : list.taskseries[0];
            let task_id = taskseries.task.id ? taskseries.task.id : taskseries.task[0].id;
            milk.get(
                'rtm.tasks.setURL',
                debug,
                {
                    list_id: list.id,
                    taskseries_id: taskseries.id,
                    task_id: task_id,
                    timeline: milk.timeline,
                    url: link
                },
                resolve,
                reject
            );
        });
    }

    addDueDateToTask(milk, debug, list, dueDate) {
        return new Promise((resolve, reject) => {
            let taskseries = list.taskseries.id ? list.taskseries : list.taskseries[0];
            let task_id = taskseries.task.id ? taskseries.task.id : taskseries.task[0].id;
            milk.get(
                'rtm.tasks.setDueDate',
                debug,
                {
                    list_id: list.id,
                    taskseries_id: taskseries.id,
                    task_id: task_id,
                    timeline: milk.timeline,
                    due: dueDate,
                },
                resolve,
                reject
            );
        });
    }

    addNoteToTask(milk, debug, list, title, text) {
        return new Promise((resolve, reject) => {
            let taskseries = list.taskseries.id ? list.taskseries : list.taskseries[0];
            let task_id = taskseries.task.id ? taskseries.task.id : taskseries.task[0].id;
            milk.get(
                'rtm.tasks.notes.add',
                debug,
                {
                    list_id: list.id,
                    taskseries_id: taskseries.id,
                    task_id: task_id,
                    timeline: milk.timeline,
                    note_title: title,
                    note_text: text
                },
                resolve,
                reject
            );
        });
    }

    getSettings(milk, debug) {
        return new Promise((resolve, reject) => {
            milk.get(
                'rtm.settings.getList',
                debug,
                {},
                resolve,
                reject
            );
        });
    }

    getTimezoneOffset(milk, debug, timezone) {
        return new Promise((resolve, reject) => {
            milk.get(
                'rtm.time.convert',
                debug,
                {
                    to_timezone: timezone
                },
                resolve,
                reject
            );
        });
    }

    getLists(milk, debug) {
        return new Promise((resolve, reject) => {
            milk.get(
                'rtm.lists.getList',
                debug,
                {},
                resolve,
                reject
            );
        });
    }

    addList(milk, debug, name) {
        return new Promise((resolve, reject) => {
            milk.get(
                'rtm.lists.add',
                debug,
                {
                    name: name,
                    timeline: milk.timeline
                },
                resolve,
                reject
            );
        });
    }
}

