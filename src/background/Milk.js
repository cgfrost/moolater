/* global browser: false */

const AUTH_URL = 'https://www.rememberthemilk.com/services/auth/';
const BASE_URL = 'https://api.rememberthemilk.com/services/rest/';
const API_VERSION = '2';
const FORMAT = 'json';
const INVALID = 'INVALID';

class Milk {

    constructor(data, permissions, frob, token, debug) {
        if (!data.a || !data.b) {
            throw 'Milk Error: Missing data.';
        }
        this.data = data;
        this.permissions = (permissions) ? permissions : 'write';
        this.hasher = new Hash();
        this.milkAuth = new MilkAuth();
        this.auth_token = token;
        this.frob = frob;
        this.timeline = undefined;
        this.ensureFrob(debug);
    }

    static log(message, debugMode) {
        if (debugMode) {
            console.log(message);
        }
    }

    /**
     * Check is the user is authenticated.
     *
     * @returns {boolean} true if the frob and token are set
     */
    isUserReady(debug) {
        Milk.log(`User ready, frob: ${this.frob}, token: ${this.auth_token}`, debug);
        return this.frob !== INVALID && this.auth_token !== INVALID;
    }

	/**
	 * Generates a RTM authentication URL
	 *
	 * @return {String} to send the user to for authorizing
	 */
	getAuthUrl() {
		let params = {
			api_key: this.data.a,
			perms: this.permissions,
            frob: this.frob
		};
		return AUTH_URL + this.encodeUrlParams(params);
	};

	/**
	 * Gets the timeline ID
	 *
	 * @return     Returns the timeline ID String
	 */
	setTimeline(debug, retry, error) {
	    Milk.log('Fetching a new timeline', debug);
		this.milkAuth.createTimeline(this, debug).then((response) => {
			this.timeline = response.rsp.timeline;
			if (retry) {
                retry();
            }
		}).catch((reason) => {
		    if (error) {
		        error(reason);
            }
		});
	};

	ensureFrob(debug) {
	    if (this.frob === INVALID) {
            this.milkAuth.getFrob(this, debug).then((response) => {
                Milk.log(`Setting frob to ${response.rsp.frob}`, debug);
                this.frob = response.rsp.frob;
                browser.storage.local.set({token: this.auth_token, frob: this.frob});
            });
        }
    }

	/**
	 * Main method for making API calls
	 *
	 * @param method    Specifies what API method to be used
     * @param debug     {boolean} Produce debug logging or not
	 * @param params    Array of API parameters to accompany the method parameter
	 * @param complete  Callback to fire after the request comes back
	 * @param error     (Optional) Callback to fire if the request fails
	 * @return          Returns the response from the RTM API
	 */
	get(method, debug, params, complete, error) {
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

		if (this.auth_token !== INVALID) {
			params.auth_token = this.auth_token;
		}

		if (this.frob !== INVALID) {
			params.frob = this.frob;
		}

		let requestUrl = BASE_URL + this.encodeUrlParams(params);
        let myHeaders = new Headers([['Content-Type', 'application/json; charset=utf-8']]);
        let fetchInit = {method: 'GET', headers: myHeaders};
		fetch(requestUrl, fetchInit).then((response) => {
		    response.text().then((text) => {

		        console.log('*************************************', debug);
		        console.log(`Request.Url     : ${requestUrl}`, debug);
		        console.log(`Request.Method  : ${method}`, debug);
		        console.log(`Response.Text   : ${text}`, debug);
		        console.log(`        .Status : ${response.status}`, debug);
		        console.log(`        .SText  : ${response.statusText}`, debug);
		        console.log('*************************************', debug);

		        if (response.status === 200) {
		            let jsonData = JSON.parse(text);
		            if (jsonData.rsp.stat === 'ok') {
		                    complete(jsonData);
		            } else {
		                this.handleError(response, jsonData.rsp, error, () => {
		                    this.get(method, params, complete, error);
		                }, debug);
		            }
		        } else {
		            this.handleError(response, undefined, error, () => {
		                this.get(method, params, complete, error);
		            }, debug);
		        }
            });
		});
	};

	handleError(response, jsonData, error, retry, debug) {
		if (response.status === 200) {
			if (jsonData.err && jsonData.err.msg && jsonData.err.code) {
				if (jsonData.err.code === '98') {
					this.auth_token = INVALID;
                    browser.storage.local.set({token: INVALID, frob: this.frob}).then(() => {
                        this.fetchToken(retry, error, debug);
                    });
					return;
				} else if (jsonData.err.code === '101') {
					this.auth_token = INVALID;
					this.frob = INVALID;
					browser.storage.local.set({token: INVALID, frob: INVALID}).then(() => {
                        this.ensureFrob(debug);
                    });
				} else if (jsonData.err.code === '300') { // Timeline is invalid
                    this.setTimeline(debug, retry, error);
				}
			}
			error(`Error ${jsonData.err.code}: ${jsonData.err.msg}`);
		} else {
			error(`Network Error:${response.status} ${response.statusText}`);
		}
	};

	fetchToken(retry, error, debug) {
	    Milk.log('Fetching new token', debug);
		this.milkAuth.getToken(this, debug).then((resp) => {
		    this.auth_token = resp.rsp.auth.token;
		    this.setTimeline(debug, retry, error);
		    browser.storage.local.set({token: resp.rsp.auth.token, frob: this.frob});
		}).catch((reason) => {
		    if (error) {
                Milk.log(`Error fetching new token ${reason.message}`, debug);
		        error(reason.message);
		    }
		});
	};

	/**
	 * Private - Encodes request parameters into URL format
	 *
	 * @param params    Array of parameters to be URL encoded
	 * @return {string} Returns the URL encoded string of parameters
	 */
	encodeUrlParams(params) {
		params = (params) ? params : {};
		let paramString = '?';
        let firstParam = true;

		params.api_key = this.data.a;

		for (let key in params) {
			if (firstParam) {
				paramString += `${key}=${encodeURIComponent(params[key])}`;
			} else {
				paramString += `&${key}=${encodeURIComponent(params[key])}`;
			}
			firstParam = false;
		}

		paramString += this.generateSig(params);
		return paramString;
	};

	/**
	 * Private - Generates a URL encoded authentication signature
	 *
	 * @param params    The parameters used to generate the signature
	 * @return {string} Returns the URL encoded authentication signature
	 */
	generateSig(params) {
		params = (params) ? params : {};
		let signature = '';
		let keys = Object.keys(params);

		keys.sort();
		for (let i = 0; i < keys.length; i++) {
			signature += keys[i] + params[keys[i]];
		}
		signature = this.data.b + signature;

		return `&api_sig=${this.hasher.md5(signature)}`;
	};

}
