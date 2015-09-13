/**
 *   Remember The Milk Client
 *
 *   Copyright (c) 2011 Michael Day <manveru.alma@gmail.com>
 */

(function () {
	'use strict';

	module.exports = function (appKey, appSecret, events, permissions) {

		var storage = require('sdk/simple-storage').storage,
			self = require('sdk/self'),
			Request = require('sdk/request').Request,
			md5 = require(self.data.url('md5')),
			me = this;

		this.authUrl = 'https://www.rememberthemilk.com/services/auth/';
		this.baseUrl = 'https://api.rememberthemilk.com/services/rest/';
		this.format = 'json';

		permissions = (permissions) ? permissions : 'read';

		if (!appKey || !appSecret) {
			throw 'RTM Error: App Key and Secret Key must be defined.';
		}

		this.appKey = appKey;
		this.appSecret = appSecret;
		this.permissions = permissions;

		if (storage.token) {
			this.auth_token = storage.token;
		}
		if (storage.frob) {
			this.frob = storage.frob;
		}

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

			params.frob = this.frob;

			return this.authUrl + this.encodeUrlParams(params);
		};

		events.on('token.init', () => {
			this.setTimeline();
		});

		/**
		 * Gets the timeline ID
		 *
		 * @return     Returns the timline ID String
		 */
		this.setTimeline = function () {
			this.get('rtm.timelines.create', {},
				function (response) {
					me.timeline = response.rsp.timeline;
				},
				function (fail) {
					console.warn(fail);
				}
			);
		};

		this.setFrob = function (frob) {
			storage.frob = frob;
			me.frob = frob;
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

			new Request({
				url: requestUrl,
				overrideMimeType: 'application/json; charset=utf-8',
				onComplete: (response) => {
					console.log('*************************************');
					console.log('Request.Method  : ' + method);
					console.log('Response.Text   : ' + response.text);
					console.log('        .Status : ' + response.status);
					console.log('        .Text   : ' + response.statusText);
					console.log('*************************************');
					if (response.status === 200 && response.json.rsp.stat === 'ok') {
						complete(response.json);
					} else {
						me.handleError(response, error, () => {
							me.get(method, params, complete, error);
						});
					}
				}
			}).get();
		};

		this.handleError = function (response, error, retry) {
			if (response.status === 200) {
				var rsp = response.json.rsp;
				if (rsp.err && rsp.err.msg && rsp.err.code) {
					if (rsp.err.code === '98') {
						storage.token = null;
						me.auth_token = null;
						me.fetchToken(retry, error);
					} else if (rsp.err.code === '101') {
						storage.token = null;
						me.auth_token = null;
						storage.frob = null;
						me.frob = null;
						error('Access has expired or has not been granted, please log back in to Remember the Milk');
					} else {
						error(response.json.rsp.err.msg);
					}
				} else {
					error('Unidentified error while talking to Remember the Milk');
				}
			} else {
				error('Network Error: ' + response.status + ' ' + response.statusText);
			}
		};

		this.fetchToken = function (retry, error) {
			this.get('rtm.auth.getToken', {}, (resp) => {
				me.auth_token = resp.rsp.auth.token;
				storage.token = resp.rsp.auth.token;
				events.do('token.init', 'rtm');
				if (retry) {
					retry();
				}
			}, (fail) => {
				if (error) {
					error(fail);
				}
				console.warn(fail);
			});
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

			return '&api_sig=' + md5(signature);
		};

		return this;
	};

}());
