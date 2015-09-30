(function () {
  'use strict';

  module.exports = function (events) {

    let contextMenu = require('sdk/context-menu');

    events.on('init', () => {
      console.log('init');
    });
    
    var script = "self.on('click', function (node, data) {" +
      "  console.log('clicked: ' + node.nodeName + ' data: ' + data);" +
      "});";

    let pageContext = contextMenu.PageContext();
    let selectionContext = contextMenu.SelectionContext();

    new contextMenu.Item({
      label: 'Moo Later - page',
      context: pageContext,
      contentScript: script,
      data: 'moo'
    });

    new contextMenu.Item({
      label: 'Moo Later - selection',
      context: [pageContext, selectionContext],
      contentScript: script,
      data: 'foo'
    });

  };

}());
