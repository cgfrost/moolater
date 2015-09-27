(function () {
  'use strict';

  let self = require('sdk/self'),
    ToggleButton = require('sdk/ui').ToggleButton,
    contextMenu = require("sdk/context-menu"),
    RememberTheMilk = require(self.data.url('milk.js')),
    Account = new require(self.data.url('account.js')),
    Tasks = new require(self.data.url('tasks.js')),
    Events = require(self.data.url('events.js')),
//    ContectMenu = require(self.data.url('contextMenu.js')),
    data = JSON.parse(self.data.load('data.json')),
    Hotkey = require("sdk/hotkeys").Hotkey;

  let events = new Events();
  let milk = new RememberTheMilk(data, events, 'write');
//  let contextMenu = new ContectMenu(events);

  let button = new ToggleButton({
    id: 'moolater-toggle',
    label: 'Save to milk',
    icon: {
      '18': './logo/icon-18.png',
      '32': './logo/icon-32.png',
      '36': './logo/icon-36.png',
      '64': './logo/icon-64.png',
      '128': './logo/icon-128.png'
    }
  });

  var script = "self.on('click', function (node, data) {" +
             "  console.log('clicked: ' + node.nodeName + ' data: ' + data);" +
             "});";

  let pageContext = contextMenu.PageContext();
  let selectionContext = contextMenu.SelectionContext();

  let moo = new contextMenu.Item({
    label: 'Moo Later - page',
    context: pageContext,
    contentScript: script,
    data: 'moo'
  });

  let foo = new contextMenu.Item({
    label: 'Moo Later - selection',
    context: [pageContext, selectionContext],
    contentScript: script,
    data: 'foo'
  });

  new Hotkey({
    combo: 'accel-shift-m',
    onPress: function () {
      button.click();
    }
  });

  let tasks = new Tasks(milk, button, events);
  let account = new Account(milk, button, events);

  button.on('change', (state) => {
    if (state.checked === true) {
      if (account.isReady()) {
        tasks.showAddTask();
      } else {
        account.showLogin();
      }
    } else {
      tasks.hide();
      account.hide();
    }
  });

  (function () {
    if (account.isReady()) {
      milk.get('milk.auth.checkToken', {}, () => {
        events.do('token.init', 'index');
      });
    }
  }());

}());
