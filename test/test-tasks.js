(function () {
  'use strict';

  let test = require('sdk/test');
  let {
    before, after
  } = require('sdk/test/utils');
  let system = require('sdk/system');

  let Events = require('../data/events.js');
  let Milk = require('./stub-milk.js');
  let Tasks = new require('../data/tasks.js');
  let stubButtonFactory = require('./stub-toggle-button.js');

  let setTimeout = require('sdk/timers').setTimeout;
  let stubMilk = new Milk();
  let button = stubButtonFactory('test-moolater-toggle-tasks');
  let events = new Events();

  exports['test showAddTask'] = function (assert, done) {
    if (system.env.TRAVIS) {
      console.log('Running on Travis, skipping test');
      assert.pass();
      done();
    } else {
      let tasks = new Tasks(stubMilk, button, events);
      tasks.showAddTask();
      setTimeout(() => {
        assert.strictEqual(true, tasks.isShowing(), 'Task panel not displayed.');
        done();
      }, 1000);
    }
  };

  exports['test getDefaultList'] = function (assert) {
    let tasks = new Tasks(stubMilk, button, events);
    assert.strictEqual('Read Later', tasks.getDefaultList(), 'Wrong default list returned.');
  };

  exports['test token.init event'] = function (assert) {
    stubMilk.setMethodReturn({
      rsp: {
        lists: {
          list: []
        }
      }
    });
    new Tasks(stubMilk, button, events);
    events.do('token.init');
    assert.strictEqual('rtm.lists.getList', stubMilk.getLastMethodCalled(), 'Lists not refreshed after new token event.');
  };

  before(exports, function (name) {
    console.log('================================================================================');
    console.log(`Running tasks: ${name}`);
  });

  after(exports, function (name) {
    console.log(`Finished tasks: ${name}`);
    console.log('================================================================================');
  });

  test.run(exports);

}());
