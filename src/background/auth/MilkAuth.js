class MilkAuth {

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
}

