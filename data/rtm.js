/**
 *   Remember The Milk Client
 *
 *   Copyright (c) 2011 Michael Day <manveru.alma@gmail.com>
 */

(function () {
	'use strict';

	module.exports = function (appKey, appSecret, permissions) {
		this.authUrl = 'https://www.rememberthemilk.com/services/auth/';
		this.baseUrl = 'https://api.rememberthemilk.com/services/rest/';
		this.format = 'json';

		this.self = require("sdk/self");
		this.request = require("sdk/request").Request;
		this.md5 = require(this.self.data.url("md5"));

		appKey = (appKey) ? appKey : '';
		appSecret = (appSecret) ? appSecret : '';
		permissions = (permissions) ? permissions : 'read';

		if (!appKey || !appSecret) {
			throw 'Error: App Key and Secret Key must be defined.';
		}

		this.appKey = appKey;
		this.appSecret = appSecret;
		this.permissions = permissions;

		/**
		 * Generates a RTM authentication URL
		 *
		 * @return     URL String
		 */
		this.getAuthUrl = function () {
			var params = {
				api_key: this.appKey,
				perms: this.permissions
			};

			if (this.frob) {
				params.frob = this.frob;
			}

			return this.authUrl + this.encodeUrlParams(params);
		};

		/**
		 * Gets the timeline ID
		 *
		 * @return     Returns the timline ID String
		 */
		this.setTimeline = function () {
			if (!this.timeline) {
				this.get("rtm.timelines.create", {},
					function (response) {
						this.timeline = response.rsp.timeline;
					},
					function (response) {
						console.error("Network Error: " + response.status + "-" + response.statusText);
					}
				);
			}
		};

		/**
		 * Main method for making API calls
		 *
		 * @param method    Specifies what API method to be used
		 * @param params    Array of API parameters to accompany the method parameter
		 * @param complete  Callback to fire after the request comes back
		 * @param error     (Optional) Callback to fire if the request fails
		 * @return          Returns the reponse from the RTM API
		 */
		this.get = function (method, params, complete, error) {
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

			params.method = method;

			if (this.auth_token) {
				params.auth_token = this.auth_token;
			}

			if (this.frob) {
				params.frob = this.frob;
			}

			var requestUrl = this.baseUrl + this.encodeUrlParams(params);

			this.request({
				url: requestUrl,
				overrideMimeType: "application/json; charset=utf-8",
				onComplete: function (response) {
					console.debug("*************************************");
					console.debug("Request.Method  : " + method);
					console.debug("Response.Json   : " + response.json);
					console.debug("        .Text   : " + response.text);
					console.debug("        .Status : " + response.status);
					console.debug("        .Text   : " + response.statusText);
					console.debug("*************************************");
					if (response.status === 200) {
						complete.call(this, response.json);
					} else {
						error.call(this, response);
					}
				}
			}).get();
		};

		/**
		 * Sets an Auth Token to use on all future API calls
		 *
		 * @param token The Token to use
		 */
		this.setAuthToken = function (token) {
			this.auth_token = token;
		};

		/**
		 * Sets a Frob to use on all future API calls
		 *
		 * @param Frob to use
		 */
		this.setFrob = function (frob) {
			this.frob = frob;
		};

		/**
		 * Private - Encodes request parameters into URL format
		 *
		 * @param params    Array of parameters to be URL encoded
		 * @return          Returns the URL encoded string of parameters
		 */
		this.encodeUrlParams = function (params) {
			params = (params) ? params : {};
			var paramString = '?',
				firstParam = true;

			params.format = this.format;
			params.api_key = this.appKey;

			for (var key in params) {
				if (firstParam) {
					paramString += key + '=' + encodeURIComponent(params[key]);
				} else {
					paramString += '&' + key + '=' + encodeURIComponent(params[key]);
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
		 * @return          Returns the URL encoded authentication signature
		 */
		this.generateSig = function (params) {
			params = (params) ? params : {};
			var signature = '',
				keys = Object.keys(params);

			keys.sort();
			for (var i = 0; i < keys.length; i++) {
				signature += keys[i] + params[keys[i]];
			}
			signature = this.appSecret + signature;

			return '&api_sig=' + this.md5(signature);
		};
	};

}());
