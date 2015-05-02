var API_ENDPOINT = 'http://localhost:3000';

angular.module('services', [])

.factory('socket', function($rootScope) {
  var socket = io.connect(API_ENDPOINT);

  return {
    on: function(eventName, cb) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function () {
          cb.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, cb) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function () {
          if (cb) cb.apply(socket, args);
        });
      });
    });
  };
})


