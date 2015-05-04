angular.module('starter.controllers', ['services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, socket, Auth) {
  // Form data for the login modal
  $scope.loginData = {};
  debugger
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(user) {
    console.log('Doing login', $scope.loginData);
    var user = $scope.loginData;
    console.log(user);

    Auth.login(user.username, user.password).then(function(data) {
      console.log('auth passed');
      if (data.success) {
        console.log('successful login');
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);
      } else {
        alert('Username / Password is incorrect');
      }
    });
  };
})

.controller('LoginCtrl', function($scope, $state, Auth) {
  $scope.user = { name: '', password: '' };

  $scope.login = function login(user) {
    Auth.login(user.name, user.password).then(function(data) {
      console.log('auth passed');
      if (data.success) {
        console.log('auth was successful');
        $state.go('app');
      } else {
        alert('Username / password not valid. Try again');
      }
    });
  }
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});

// SERVICES
var baseUrl = 'http://localhost:1337';

angular.module('services', [])

.factory('socket', function socket($rootScope) {
  var socket = io(baseUrl);

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
    }
  };
})


.factory('Auth', function Auth($q, $http) {
  var user = null;

  var login = function login (name, password) {
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

  var currentUser = function currentUser (user) {
    return user;
  }

  var logout = function logout () {
    user = null;
    window.localStorage.removeItem('user');
  }

  return {
    login: login,
    logout: logout,
    currentUser: currentUser
  };
});
