/**
 * Created by valts on 10.10.2016.
 */
(function() {
    var app = angular.module('app');

    app.factory('Lists', ["$resource", "$cookies", function($resource, $cookies){

        var path = "http://localhost:3000/api/";
        var lists = {};

        // Get all lists
        lists.getAll = function(callback) {

            var result = $resource(path + 'lists', {}, {
                get: {
                    method: 'GET',
                    headers: {
                        'x-access-token': $cookies.get("token")
                    }
                }
            });

            result.get({}, function (res) {
                callback(res.meta.message, res.data);
            }, function(res) {
                callback(res.data.meta.message, null)
            });
        };

        // Get list with ID
        lists.get = function(listID, callback) {

            var result = $resource(path + 'lists/' + listID, {}, {
                get: {
                    method: 'GET',
                    headers: {
                        'x-access-token': $cookies.get("token")
                    }
                }
            });

            result.get({}, function (res) {
                callback(res.meta.message, res.data);
            }, function(res) {
                callback(res.data.meta.message, null)
            });
        };

        // Add list
        lists.add = function(listName, callback) {

            var resource = $resource(path + 'lists', {}, {
                save: {
                    method: 'post',
                    headers: {
                        'x-access-token': $cookies.get("token")
                    }
                }
            });

            resource.save({listName: listName}, function (res) {
                callback(res.meta.success, res.meta.message);
            }, function(res) {
                callback(res.data.meta.success, res.data.meta.message);
            });
        };

        // Rename list
        lists.rename = function(listID, listName, callback) {

            var resource = $resource(path + "lists/" + listID, {}, {
                modify: {
                    method: 'put',
                    headers: {
                        'x-access-token': $cookies.get("token")
                    }
                }
            });


            resource.modify({newName: listName}, function (res) {
                callback(res.meta.success, res.meta.message);
            }, function(res) {
                callback(res.data.meta.success, res.data.meta.message);
            });
        };

        // Remove list
        lists.remove = function(listID, callback) {

            var resource = $resource(path + "lists/" + listID, {}, {
                remove: {
                    method: 'delete',
                    headers: {
                        'x-access-token': $cookies.get("token")
                    }
                }
            });


            resource.remove({}, function (res) {
                callback(res.meta.success, res.meta.message);
            }, function(res) {
                callback(res.data.meta.success, res.data.meta.message);
            });
        };

        return lists;

    }]);
})();