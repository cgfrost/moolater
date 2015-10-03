(function () {
  'use strict';

  module.exports = function (events) {

    let contextMenu = require('sdk/context-menu');

    events.on('init', () => {
      console.log('init');
    });

    var script = 'self.on("click", function (node, data) {self.postMessage(data);});';

    new contextMenu.Item({
      label: 'Moo Later - Add task',
      contentScript: script,
      data: 'Add task',
      onMessage: function (data) {
        console.log(`clicked: + ${data}`);
        events.do('go.mooLater');
      }
    });

    new contextMenu.Item({
      label: 'Moo Later - Add task with selection',
      context: contextMenu.SelectionContext(),
      contentScript: script,
      data: 'Add task with selection',
      onMessage: function (data) {
        console.log(`clicked: + ${data}`);
      }
    });

  };

}());
