import md5 from './md5';
import MilkAuth from './MilkAuth';

const AUTH_URL = 'https://www.rememberthemilk.com/services/auth/';
const BASE_URL = 'https://api.rememberthemilk.com/services/rest/';
const API_VERSION = '2';
const FORMAT = 'json';

export default class {

	constructor(data, permissions) {
		console.log("Milk");
		this.milkAuth = new MilkAuth();
		this.permissions = (permissions) ? permissions : 'write';
		if (!data.a || !data.b) {
			throw 'Milk Error: Missing data.';
		}
		this.data = data;

		browser.storage.local.get(["token", "frob"]).then(
			(result) => {
				console.log(`Milk init: In storage frob is ${result.frob} and the token is ${result.token} `)
				if(result.frob) {
					this.frob = result.frob;
					if (result.token) {
						this.token = result.token;
						this.milkAuth.checkToken(this).then(
							() => {},
							() => {
								this.wipeToken();
								this.wipeFrob();
								this.setFrob();
							});
					} else {
						this.fetchToken(
							() => {}),
							(error) => {
								console.log(`Milk constructor - fetchToken: ${error}`);
							};
					}
				} else {
					this.setFrob();
				}
			}, (error) => {
				console.log(`Milk constructor: ${error}`);
			});
	}

	isUserReady() {
		if(this.frob && this.token) {
			this.setTimeline();
			return true;
		} else{
			return false;
		}
	}

	/**
	 * Generates a RTM authentication URL
	 *
	 * @return     URL String
	 */
	getAuthUrl() {
		var params = {
			api_key: this.data.a,
			perms: this.permissions
		};
		params.frob = this.frob;
		return AUTH_URL + this.encodeUrlParams(params);
	}

	/**
	 * Gets the timeline ID
	 *
	 * @return     Returns the timline ID String
	 */
	setTimeline(error) {
		this.milkAuth.createTimeline(this).then(
			(response) => {
				this.timeline = response.rsp.timeline;
			},
			(error) => {
				console.log(`Milk setTimeline: ${error}`);
			});
	}

	/**
	 * Obtain a new frob from RTM and save it in storage
	 *
	 * @return the new frob
	 */
	setFrob() {
		this.milkAuth.getFrob(this).then(
			(response) => {
				this.frob = response.rsp.frob
				browser.storage.local.set({
		        frob: response.rsp.frob
		    });
			},
			(error) => {
				console.log(`Milk setFrob: ${error}`);
			});
	}

	wipeFrob() {
		console.log("Wipe Frob");
		browser.storage.local.remove('frob');
		this.frob = null;
	}

	wipeToken() {
		console.log("Wipe Token");
		browser.storage.local.remove('token');
		this.token = null;
	}

	/**
	 * Main method for making API calls
	 *
	 * @param method    Specifies what API method to be used
	 * @param params    Array of API parameters to accompany the method parameter
	 * @param complete  Callback to fire after the request comes back
	 * @param error     (Optional) Callback to fire if the request fails
	 * @return          Returns the reponse from the RTM API
	 */
	queryRTM(method, params, complete, error) {
		console.log(`Calling RTM with ${method}`);

		if (!method) {
			throw 'Error: API Method must be defined.';
		}
		if (!params) {
			throw 'Error: API Params must be defined.';
		}
		if (!complete) {
			throw 'Error: API Complete function must be defined.';
		}
		if (!error) {
			error = function () {};
		}

		params.v = API_VERSION;
		params.format = FORMAT;
		params.method = method;

		if (this.token) {
			params.auth_token = this.token;
		}

		if (this.frob) {
			params.frob = this.frob;
		}

		let requestUrl = BASE_URL + this.encodeUrlParams(params);
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', requestUrl, true);
		xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState == 4){
				console.log('*************************************');
				console.log(`Request.Url           : ${requestUrl}`);
				console.log(`Request.Method        : ${method}`);
				console.log(`Response.status       : ${xhttp.status}`);
				console.log(`        .statusText   : ${xhttp.statusText}`);
				console.log(`        .responseText : ${xhttp.responseText}`);
				console.log('*************************************');
				if (xhttp.status == 200) {
					let jsonResponse = JSON.parse(xhttp.responseText);
					if (jsonResponse.rsp.stat === 'ok') {
						complete(jsonResponse);
					} else {
						this.handleError(jsonResponse, error, () => {
							this.queryRTM(method, params, complete, error);
						});
					}
				} else {
					error(`Network Error:${response.status} ${response.statusText}`);
				};
			};
		};
		xhttp.send();
	}

	handleError(response, error, retry) {
		var rsp = response.rsp;
		if (rsp.err && rsp.err.msg && rsp.err.code) {
			if (rsp.err.code === '98') {
				this.wipeToken();
				this.fetchToken(retry, error);
				return;
			} else if (rsp.err.code === '101') {
				this.wipeToken();
				this.wipeFrob();
			}
		}
		error(`Error ${rsp.err.code}: ${rsp.err.msg}`);
	}

	fetchToken(retry, error) {
		this.milkAuth.getToken(this)
			.then((response) => {
				this.token = response.rsp.auth.token;
				browser.storage.local.set({
		        token: response.rsp.auth.token
		    });
				this.setTimeline(error);
				if (retry) {
					retry();
				}
			}).catch((reason) => {
				if (error) {
					error(reason);
				}
			});
	}

		/**
		 * Private - Encodes request parameters into URL format
		 *
		 * @param params    Array of parameters to be URL encoded
		 * @return          Returns the URL encoded string of parameters
		 */
		encodeUrlParams(params) {
			params = (params) ? params : {};
			var paramString = '?',
				firstParam = true;

			params.api_key = this.data.a;

			for (var key in params) {
				if (firstParam) {
					paramString += `${key}=${encodeURIComponent(params[key])}`;
				} else {
					paramString += `&${key}=${encodeURIComponent(params[key])}`;
				}
				firstParam = false;
			}

			paramString += this.generateSig(params);
			return paramString;
		}

		/**
		 * Private - Generates a URL encoded authentication signature
		 *
		 * @param params    The parameters used to generate the signature
		 * @return          Returns the URL encoded authentication signature
		 */
		generateSig(params) {
			params = (params) ? params : {};
			var signature = '', keys = Object.keys(params);
			keys.sort();
			for (var i = 0; i < keys.length; i++) {
				signature += keys[i] + params[keys[i]];
			}
			signature = this.data.b + signature;
			return `&api_sig=${md5(signature)}`;
		}

		// return this;
}
