class MilkAuth {

    getToken(milk, debug) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.auth.getToken', debug, {},
                     resolve,
                     reject);
        });
    }

    getFrob(milk, debug) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.auth.getFrob', debug, {},
                     resolve,
                     reject);
        });
    }

    createTimeline(milk, debug) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.timelines.create', debug, {},
                     resolve,
                     reject);
        });
    }

}
