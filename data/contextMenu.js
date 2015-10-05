(function () {
  'use strict';

  module.exports = function (events) {

    let contextMenu = require('sdk/context-menu');
    let script = 'self.on("click", function () {self.postMessage();});';

    new contextMenu.Item({
      label: 'Moo Later - Add task',
      contentScript: script,
      data: 'Add task',
      onMessage: function () {
        events.do('go.mooLater');
      }
    });

    let script2 = 'self.on("click", function () {self.postMessage(window.getSelection().toString());});';

    new contextMenu.Item({
      label: 'Moo Later - Add task with selection',
      context: contextMenu.SelectionContext(),
      contentScript: script2,
      data: 'Add task with selection',
      onMessage: function (selection) {
        console.log(`FOO: ${selection}`);
        console.log('Clicked: Add task with selection');
      }
    });

  };

}());
