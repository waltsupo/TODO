/**
 * Created by valts on 11.10.2016.
 */
(function() {

    var app = angular.module('app');

    app.controller("RegCtrl", function ($scope, $rootScope, Auth) {

        // Errors
        $scope.error = false;
        $scope.errMessage = "";

        // If loading
        $scope.loading = false;
        // User not logged in
        $rootScope.logged = false;

        $scope.register = function () {
            $scope.loading = true;

            // Register
            Auth.register($scope.username, $scope.password, function (success, message) {
                if (!success) {
                    $scope.error = true;
                    $scope.errMessage = message;
                }
                $scope.loading = false;
            });
        };
    });
})();