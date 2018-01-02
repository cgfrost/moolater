class MilkAuth {

    getToken(milk) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.auth.getToken', false, {},
                     resolve,
                     reject);
        });
    }

    checkToken(milk) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.auth.checkToken', false, {},
                     resolve,
                     reject);
        });
    }

    getFrob(milk) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.auth.getFrob', false, {},
                     resolve,
                     reject);
        });
    }

    createTimeline(milk) {
        return new Promise((resolve, reject) => {
            milk.get('rtm.timelines.create', false, {},
                     resolve,
                     reject);
        });
    }

}
