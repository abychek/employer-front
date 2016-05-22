var manager = angular.module('manager', [
    'authorization-service',
    'is-authorized-checker',
    'authorization-ctrl',
    'header-ctrl'
]);
var authorizationService = angular.module('authorization-service', []);
authorizationService.service('authorizationService', function (localStorageService, $http) {
    return {
        login: function (id, token) {
            localStorageService.set('auth-token', token);
            localStorageService.set('user-id', id);
            $http.defaults.headers.common.Authorization = 'Basic ' + localStorageService.get('auth-token');
        }
    }
});
var isAuthorizedChecker = angular.module('is-authorized-checker', []);
isAuthorizedChecker.service('isAuthorizedChecker', function ($rootScope, localStorageService) {
    return {
        check: function () {
            var isAuthorised = localStorageService.get('auth-token');
            if (isAuthorised) {
                $rootScope.isAuthorised = true;
            }
            return isAuthorised;
        }
    }
});

var authorization = angular.module('authorization-ctrl', []);
authorization.controller('AuthorizationCtrl', [
    '$scope',
    '$http',
    '$location',
    'authorizationService',
    function ($scope, $http, $location, authorizationService) {
        $scope.user = {
            username: '',
            password: ''
        };

        $scope.login = function () {
            console.log(btoa($scope.user.username + ':' + $scope.user.password));
            $http.get(
                '/api/auth/login',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                        'Authorization': 'Basic ' + btoa($scope.user.username + ':' + $scope.user.password)
                    }
                }
            ).then(function successCallback(response) {
                var authToken = btoa($scope.user.username + ':' + $scope.user.password);
                authorizationService.login(response.data.id, authToken);
                $location.path('/profile');
            }, function errorCallback(response) {
                console.log(response)
            });
        }
    }]);
var header = angular.module('header-ctrl', []);
header.controller('HeaderCtrl', [
    '$scope',
    '$rootScope',
    '$location',
    'localStorageService',
    'isAuthorizedChecker',
    function ($scope, $rootScope, $location, localStorageService, isAuthorizedChecker) {
        $scope.redirectToProfile = function () {
            $location.path('/profile');
        }
    }]);