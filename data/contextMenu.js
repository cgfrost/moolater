(function () {
	'use strict';

	module.exports = function (events) {
    
		events.on('init', () => {
      console.log('init');
		});
    
  };
  
}());