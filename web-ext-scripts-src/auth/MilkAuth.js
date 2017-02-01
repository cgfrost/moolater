export default class {

	constructor() {
		console.log("MilkAuth");
	}

	getToken(milk) {
		return new Promise((resolve, reject) => {
			milk.queryRTM('rtm.auth.getToken', {},
				resolve,
				reject);
		});
	}

	checkToken(milk) {
		return new Promise((resolve, reject) => {
			milk.queryRTM('rtm.auth.checkToken', {},
				resolve,
				reject);
		});
	}

	getFrob(milk) {
		return new Promise((resolve, reject) => {
			milk.queryRTM('rtm.auth.getFrob', {},
				resolve,
				reject);
		});
	}

	createTimeline(milk) {
		return new Promise((resolve, reject) => {
			milk.queryRTM('rtm.timelines.create', {},
				resolve,
				reject);
		});
	}

}
