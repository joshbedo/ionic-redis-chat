var baseUrl = 'http://localhost:3000';

angular.module('services', [])

.factory('socket', function($rootScope) {
  var socket = io.connect(baseUrl);

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


.factory('Auth', function Auth($q, $http) {
  var user = null;

  function login (name, password) {
    var defer = $q.defer();

    var url = baseUrl + '/login';
    var postData = { name: name, password: password };

    $http.post(url, postData).success(function(response) {
      if (response.success && response.success === true) {
        user = { name: response.name, id: response.id };
        window.localStorage.setItem('user', JSON.stringify(user));
        return defer.resolve(response);
      } else {
        return defer.resolve('No user found');
      }
    }).error(function(err) {
      defer.reject(err);
    });

    return defer.promise;
  }

  function currentUser (user) {
    return user;
  }

  function logout () {
    user = null;
    window.localStorage.removeItem('user');
  }

  return {
    login: login,
    logout: logout,
    currentUser: currentUser
  };
});
