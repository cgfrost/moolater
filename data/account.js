(function () {
	'use strict';

	module.exports = function (rtm, button) {

		let storage = require('sdk/simple-storage').storage,
			windows = require('sdk/windows').browserWindows,
			self = require('sdk/self'),
			setTimeout = require('sdk/timers').setTimeout,
			Panel = require('sdk/panel').Panel,
			me = this;

		let loginPanel = new Panel({
			contentURL: self.data.url('views/login/login.html'),
			position: button,
			height: 240,
			width: 350,
			onHide: () => {
				button.state('window', {
					checked: false
				});
			}
		});

		this.showLogin = () => {
			loginPanel.port.emit('set-state', true);
			loginPanel.port.emit('set-button-state', true);
			loginPanel.show();
			rtm.get('rtm.auth.getFrob', {}, (resp) => {
				loginPanel.port.emit('set-button-state', false);
				storage.frob = resp.rsp.frob;
				rtm.frob = resp.rsp.frob;
			}, (fail) => {
				me.flashState(fail, 'error');
			});
		};

		this.isReady = () => {
			if (storage.token && storage.frob) {
				return true;
			}
			return false;
		};

		loginPanel.port.on('do-login', () => {
			loginPanel.port.emit('set-state', false, 'Requesting permission', 'loading');
			windows.open({
				url: rtm.getAuthUrl(),
				onClose: () => {
					loginPanel.port.emit('set-state', true);
					rtm.fetchToken();
				}
			});
			button.state('window', {
				checked: false
			});
		});

		this.flashState = (message, icon) => {
			loginPanel.port.emit('set-state', false, message, icon);
			setTimeout(() => {
				loginPanel.hide();
			}, 1200);
			setTimeout(() => {
				loginPanel.port.emit('set-state', true);
			}, 1300);
		};
	};

}());
