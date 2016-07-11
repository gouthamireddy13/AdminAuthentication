(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name angularNodeTokenAuthApp.controller:RegisterCtrl
     * @description
     * # RegisterCtrl
     * Controller of the angularNodeTokenAuthApp
     */
    angular.module('angularNodeTokenAuthApp').controller('LoginCtrl', LoginController);

    LoginController.$inject = ['$scope', '$log', '$rootScope', '$cookieStore', 'alert', '$http', '$state', 'userApiService', 'authToken'];

    function LoginController($scope, $log, $rootScope, $cookieStore, alert, $http, $state, userApiService, authToken) {
        var _self = this;
        this.username = '';
        this.password = '';
        _self.submit = function() {
            var user = {
                username: _self.username,
                password: _self.password
            };

            userApiService.login(user).then(function(response) {
                if (response.token) {
                    authToken.setToken(response.token, response.user);
                    $state.go('main');
                } else {
                    alert('warning', 'Oops!', 'Something is wrong!, check your credential and try again.');
                }
            }).catch(function(err) {
                alert('warning', 'Oops!', 'Something is wrong!, Check your credential and try again.');
            });
        };
    }

}());