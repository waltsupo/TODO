/**
 * Created by valts on 10.10.2016.
 */
(function() {
    var app = angular.module('app');

    app.factory('Auth', ["$resource", "$cookies", function($resource, $cookies){

        var path = "http://localhost:3000/";
        var auth = {};

        // Login, save token if success
        auth.login = function(username, password, callback) {

            var resource = $resource(path + "login");

            resource.save({name: username, password: password}, function (res) {
                $cookies.put("token", res.data);
                callback(res.meta.success, res.meta.message);
            }, function(res) {
                callback(res.data.meta.success, res.data.meta.message);
            });
        };

        // Register, log in if success
        auth.register = function(username, password, callback) {

            var resource = $resource(path + "register");

            resource.save({name: username, password: password}, function () {

                auth.login(username, password, function(res2) {
                    location.href = "#/lists";
                    callback(res2.meta.success, res2.meta.message);
                }, function (res2){
                    callback(res2.data.meta.success, res2.data.meta.message);
                });
            }, function(res) {
                callback(res.data.meta.success, res.data.meta.message);
            });
        };

        auth.verify = function (callback) {

            var result = $resource(path + 'verify', {}, {
                get: {
                    method: 'GET',
                    headers: {
                        'x-access-token': $cookies.get("token")
                    }
                }
            });

            result.get({}, function (res) {
                callback(res.meta.success);
            }, function(res) {
                console.log(res);
                callback(res.data.meta.success)
            });
        };

        return auth;

    }]);
})();