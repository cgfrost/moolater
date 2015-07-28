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
		 * @param frob Optional frob for use in desktop applications
		 * @return     Returns the reponse from the RTM API
		 */
		this.getAuthUrl = function (frob) {
			var params,
				url;

			params = {
				api_key: this.appKey,
				perms: this.permissions
			};

			if (frob) {
				params.frob = frob;
			}

			url = this.authUrl + this.encodeUrlParams(params);

			return url;
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

			var requestUrl = this.baseUrl + this.encodeUrlParams(params);

			this.request({
				url: requestUrl,
				overrideMimeType: "application/json; charset=utf-8",
				onComplete: function (response) {
					console.log("*************************************");
					console.log("Request.Method  : " + method);
					console.log("Response.Json   : " + response.json);
					console.log("        .Text   : " + response.text);
					console.log("        .Status : " + response.status);
					console.log("        .Text   : " + response.statusText);
					console.log("*************************************");
					if(response.status === 200) {
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
				i,
				keys;

			keys = Object.keys(params);
			keys.sort();

			for (i = 0; i < keys.length; i++) {
				signature += keys[i] + params[keys[i]];
			}

			signature = this.appSecret + signature;

			return '&api_sig=' + this.md5(signature);
		};
	};

}());
