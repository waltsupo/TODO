/**
 * Created by valts on 11.10.2016.
 */
(function () {

    var app = angular.module('app');

    app.controller("LogoutCtrl", function ($scope, $rootScope, $cookies) {

        // Remove token
        $rootScope.logged = false;
        $cookies.remove("token");
    });
})();