/* exported Skipjaq */


class Skipjaq {

    constructor(token) {
        // this.hasher = new Hash();
        this.auth_token = token;
        this.baseUrl = "https://skipjaq.io/auth/api/";
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
        Skipjaq.log(`User ready, token: ${this.auth_token}`, debug);
        return this.auth_token !== "INVALID";
    }

    post(path, debug, params, body, complete, error) {
        this.httpCall("POST", path, debug, params, body, complete, error);
    }

    get(path, debug, params, body, complete, error) {
        this.httpCall("GET", path, debug, params, body, complete, error);
    }

    /**
     * Main method for making API calls
     *
     * @param method    Specifies what API method to be used, POST, GET, etc...
     * @param path      The path to add on to the base path.
     * @param debug     {boolean} Produce debug logging or not
     * @param params    Array of API parameters to accompany the method parameter
     * @param body      Map object to send as a JSON body payload
     * @param complete  Callback to fire after the request comes back
     * @param error     (Optional) Callback to fire if the request fails
     * @return          Returns the response from the RTM API
     */
    httpCall(method, path, debug, params, body, complete, error) {
        if (!method) {
            throw "Error: API Method must be defined.";
        }
        if (!params) {
            throw "Error: API Params must be defined.";
        }
        if (!body) {
            throw "Error: API Body must be defined.";
        }
        if (!complete) {
            throw "Error: API Complete function must be defined.";
        }
        if (!error) {
            error = function () {};
        }

        if (this.auth_token !== "INVALID") {
            params.auth_token = this.auth_token;
        }

        let requestUrl = `${this.baseUrl}${path}${this.encodeUrlParams(params)}`;
        let myHeaders = new Headers([["Content-Type", "application/json; charset=utf-8"]]);
        let request;
        if (method !== "GET" && method !== "HEAD") { // These http methods must not have a body.
            request = new Request(requestUrl, {method: method, headers: myHeaders, body: JSON.stringify(body)});
        } else {
            request = new Request(requestUrl, {method: method, headers: myHeaders});
        }

        fetch(request).then((response) => {
            response.text().then((text) => {

                Skipjaq.log("*************************************", debug);
                Skipjaq.log(`Request.Url     : ${requestUrl}`, debug);
                Skipjaq.log(`Request.Method  : ${method}`, debug);
                Skipjaq.log(`Response.Text   : ${text}`, debug);
                Skipjaq.log(`        .Status : ${response.status}`, debug);
                Skipjaq.log(`        .SText  : ${response.statusText}`, debug);
                Skipjaq.log("*************************************", debug);

                if (response.status === 200) {
                    let jsonData = JSON.parse(text);
                    complete(jsonData);
                } else {
                    Skipjaq.log(`Network Error:${response.status} ${response.statusText}`);
                    error(`Network Error:${response.status} ${response.statusText}`);
                }
            });
        });
    }
    //
    // handleError(response, jsonData, error) {
    //     if (response.status === 200) {
    //         if (jsonData.err && jsonData.err.msg && jsonData.err.code) {
    //             this.auth_token = INVALID;
    //             // if (jsonData.err.code === '98') {
    //             // 	this.auth_token = INVALID;
    //             //    browser.storage.local.set({token: INVALID}).then(() => {
    //             //        this.fetchToken(retry, error, debug);
    //             //    });
    //             // 	return;
    //             // } else if (jsonData.err.code === '101') {
    //             // 	this.auth_token = INVALID;
    //             // 	this.frob = INVALID;
    //             // 	browser.storage.local.set({token: INVALID, frob: INVALID}).then(() => {
    //             //        this.ensureFrob(debug);
    //             //    });
    //             // } else if (jsonData.err.code === '300') { // Timeline is invalid
    //             //    this.setTimeline(debug, retry, error);
    //             // }
    //         }
    //         error(`Error ${jsonData.err.code}: ${jsonData.err.msg}`);
    //     } else {
    //         error(`Network Error:${response.status} ${response.statusText}`);
    //     }
    // }

    // fetchToken(retry, error, debug) {
    //    Skipjaq.log('Fetching new token', debug);
    // 	this.milkAuth.getToken(this, debug).then((resp) => {
    // 	    this.auth_token = resp.rsp.auth.token;
    // 	    this.setTimeline(debug, retry, error);
    // 	    browser.storage.local.set({token: resp.rsp.auth.token});
    // 	}).catch((reason) => {
    // 	    if (error) {
    //            Skipjaq.log(`Error fetching new token ${reason.message}`, debug);
    // 	        error(reason.message);
    // 	    }
    // 	});
    // };

    setToken(token) {
        this.auth_token = token;
    }

    /**
	 * Encodes request parameters into URL format
	 *
	 * @param params    Array of parameters to be URL encoded
	 * @return {string} Returns the URL encoded string of parameters
	 */
    encodeUrlParams(params) {
        params = (params) ? params : {};
        let paramString = "?";
        let firstParam = true;
        let hasParams;

        for (let key in params) {
            hasParams = true;
            if (firstParam) {
                // paramString += `${key}=${encodeURIComponent(params[key])}`;
                paramString += `${key}=${params[key]}`;
            } else {
                // paramString += `&${key}=${encodeURIComponent(params[key])}`;
                paramString += `&${key}=${params[key]}`;
            }
            firstParam = false;
        }

        // paramString += this.generateSig(params);
        return hasParams ? paramString : "";
    }

    /**
	 * Private - Generates a URL encoded authentication signature
	 *
	 * @param params    The parameters used to generate the signature
	 * @return {string} Returns the URL encoded authentication signature
	 */
    // generateSig(params) {
    // 	params = (params) ? params : {};
    // 	let signature = '';
    // 	let keys = Object.keys(params);
    //
    // 	keys.sort();
    // 	for (let i = 0; i < keys.length; i++) {
    // 		signature += keys[i] + params[keys[i]];
    // 	}
    // 	signature = this.data.b + signature;
    //
    // 	return `&api_sig=${this.hasher.md5(signature)}`;
    // };

}
