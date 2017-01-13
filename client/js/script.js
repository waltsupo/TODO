(function() {
    "use strict";
    var app = angular.module("app", ["ngRoute", "ngResource", "ngCookies"]);

    // If error currently visible
    var error = false;
    // Error message to show to user
    var errMessage = "";

    // Routes
    app.config(function ($routeProvider) {

        $routeProvider.when("/login", {
            templateUrl: "../client/templates/login.html",
            controller: "LoginCtrl"
        });

        $routeProvider.when("/lists", {
            templateUrl: "../client/templates/lists.html",
            controller: "ListsCtrl"
        });

        $routeProvider.when("/register", {
            templateUrl: "../client/templates/register.html",
            controller: "RegCtrl"
        });

        $routeProvider.when("/logout", {
            templateUrl: "../client/templates/logout.html",
            controller: "LogoutCtrl"
        });

        $routeProvider.otherwise("/login", {
            templateUrl: "../client/templates/login.html",
            controller: "LoginCtrl"
        });
    });

    app.run(function ($rootScope) {
        $rootScope.logged = false;
    });
})();