/* exported SkipjaqAction */

class SkipjaqAction {

    getToken(skipjaq, debug, id, password) {
        return new Promise((resolve, reject) => {
            skipjaq.post("auth", debug, {}, {
                user: id,
                password: password,
                host: "skipjaq.io"
            },
            resolve,
            reject);
        });
    }

    // addTask(skipjaq, debug, name, listId) {
    //     return new Promise((resolve, reject) => {
    //         browser.storage.local.get('useSmartAdd').then((useSmartAdd) => {
    //             skipjaq.get('rtm.tasks.add', debug, {}, {
    //                          list_id: listId,
    //                          name: name,
    //                          timeline: skipjaq.timeline,
    //                          parse: useSmartAdd ? 1 : 0
    //                      },
    //                      resolve,
    //                      reject);
    //         });
    //     });
    // }
    //
    // addUrlToTask(skipjaq, debug, list, link) {
    //
    //     let taskseries = list.taskseries.id ? list.taskseries : list.taskseries[0];
    //     let task_id = taskseries.task.id ? taskseries.task.id : taskseries.task[0].id;
    //
    //     return new Promise((resolve, reject) => {
    //         skipjaq.get('rtm.tasks.setURL', debug, {}, {
    //                      list_id: list.id,
    //                      taskseries_id: taskseries.id,
    //                      task_id: task_id,
    //                      url: link,
    //                      timeline: skipjaq.timeline
    //                  },
    //                  resolve,
    //                  reject);
    //     });
    // }
    //
    // addNoteToTask(skipjaq, debug, list, title, text) {
    //     return new Promise((resolve, reject) => {
    //
    //         let taskseries = list.taskseries.id ? list.taskseries : list.taskseries[0];
    //         let task_id = taskseries.task.id ? taskseries.task.id : taskseries.task[0].id;
    //
    //         skipjaq.get('rtm.tasks.notes.add', debug, {
    //                      list_id: list.id,
    //                      taskseries_id: taskseries.id,
    //                      task_id: task_id,
    //                      timeline: skipjaq.timeline,
    //                      note_title: title,
    //                      note_text: text
    //                  },
    //                  resolve,
    //                  reject);
    //     });
    // }
    //
    // getLists(skipjaq, debug) {
    //     return new Promise((resolve, reject) => {
    //         skipjaq.get('rtm.lists.getList', debug, {},
    //                  resolve,
    //                  reject);
    //     });
    // }
    //
    // addList(skipjaq, debug, name) {
    //     return new Promise((resolve, reject) => {
    //         skipjaq.get('rtm.lists.add', debug, {
    //                      name: name,
    //                      timeline: skipjaq.timeline
    //                  },
    //                  resolve,
    //                  reject);
    //     });
    // }
}

