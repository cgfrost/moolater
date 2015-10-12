(function () {
	'use strict';

	module.exports = function (milk, button) {

		let storage = require('sdk/simple-storage').storage,
			windows = require('sdk/windows').browserWindows,
			self = require('sdk/self'),
			setTimeout = require('sdk/timers').setTimeout,
			milkAuth = require(self.data.url('milk/MilkAuth.js')),
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
			if (!milk.hasFrob()) {
				loginPanel.port.emit('set-button-state', true);
				milkAuth.getFrob(milk).then((resp) => {
					loginPanel.port.emit('set-button-state', false);
					milk.setFrob(resp.rsp.frob);
				}, (reason) => {
					me.flashState(reason, 'error');
				});
			} else {
				loginPanel.port.emit('set-button-state', false);
			}
			loginPanel.show();
		};

		this.hide = () => {
			loginPanel.hide();
		};

		this.isShowing = () => {
			return loginPanel.isShowing;
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
				url: milk.getAuthUrl(),
				onClose: () => {
					loginPanel.port.emit('set-state', true);
					milk.fetchToken();
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
