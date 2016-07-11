(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name angularNodeTokenAuthApp.controller:RegisterCtrl
     * @description
     * # RegisterCtrl
     * Controller of the angularNodeTokenAuthApp
     */
    angular.module('angularNodeTokenAuthApp').controller('RegisterCtrl', RegisterController);

    RegisterController.$inject = ['$scope', '$log', '$rootScope', 'alert', '$http', '$state', 'authToken', '$auth', 'userApiService'];

    function RegisterController($scope, $log, $rootScope, alert, $http, $state, authToken, $auth, userApiService) {
        var _self = this;
        this.username = '';
        this.email_id = '';
        this.password = '';
        this.password_confirm = '';
        this.address = '';
        this.zipcode = '';
        this.companyname = '';

        init();


        function init() {
            console.log('Registration controller loaded');
        }


        function getUser(user) {
            userApiService.getUser(user).then(function(response) {

                console.log(response);
                if (!response.Users.length) {
                    saveUser(user);
                } else {
                    alert('warning', 'Oops!', 'Couldn\'t register, User name already exist');
                }
            }).catch(function(err) {
                alert('warning', 'Oops!', 'Couldn\'t register');
            });
        }

        function saveUser(user) {
            userApiService.saveUser(user).then(function(response) {
                if (response.token) {
                    _self.username = '';
                    _self.email_id = '';
                    _self.password = '';
                    _self.password_confirm = '';
                    _self.address = '';
                    _self.zipcode = '';
                    _self.companyname = '';

                    alert('success', 'User Registration!', 'sucessfully completed');
                    authToken.setToken(response.token, response.user);
                    $state.go('register');
                }
            }).catch(function(err) {
                alert('warning', 'Oops!', 'Couldn\'t register');
            });
        }


        _self.submit = function() {
            var user = {
                username: _self.username,
                email_id: _self.email_id,
                password: _self.password,
                address: _self.address,
                zipcode: _self.zipcode,
                companyname: _self.companyname
            };
            console.log(user);
            if (_self.password != _self.password_confirm) {
                alert('danger', 'Oops!', 'Your password doesn\'t match!');
                return false;
            }
            getUser(user);
        };
    }

}());
