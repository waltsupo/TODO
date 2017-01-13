/**
 * Created by valts on 11.10.2016.
 */
(function () {

    var app = angular.module('app');

    app.controller("LoginCtrl", function ($scope, $rootScope, $cookies, Auth) {

        // Errors
        $scope.error = false;
        $scope.errMessage = "";

        // Tells if loading something
        $scope.loading = false;
        // User is not logged in
        $rootScope.logged = false;

        // If user has token, log in
        if ($cookies.get("token") != undefined) {
            $scope.loading = true;
            Auth.verify(function(success) {
                if (success) {
                    location.href = "#/lists";
                } else {
                    $cookies.remove("token");
                }
                $scope.loading = false;
            });
        }

        $scope.login = function() {
            $scope.loading = true;

            // Login
            Auth.login($scope.username, $scope.password, function (success, message) {
                if (success) {
                    location.href = "#/lists";
                } else {
                    $scope.error = true;
                    $scope.errMessage = message;
                }
                $scope.loading = false;
            });
        };
    });
})();