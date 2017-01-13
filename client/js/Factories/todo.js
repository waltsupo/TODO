/**
 * Created by valts on 14.10.2016.
 */
(function() {
    var app = angular.module('app');

    app.factory('Todo', ["$resource", "$cookies", function($resource, $cookies){

        var path = "http://localhost:3000/api/";
        var todo = {};

        // Add to do
        todo.add = function (listID, values, callback) {

            var resource = $resource(path + 'lists/' + listID + "/todo", {}, {
                save: {
                    method: 'post',
                    headers: {
                        'x-access-token': $cookies.get("token")
                    }
                }
            });

            resource.save({todo: values.todo, priority: values.priority, done: 'false'}, function (res) {
                callback(res.meta.success, res.meta.message);
            }, function(res) {
                callback(res.data.meta.success, res.data.meta.message);
            });
        };

        // Remove to do from list
        todo.remove = function (listID, todoID, callback) {

            var resource = $resource(path + "lists/" + listID + "/todo/" + todoID, {}, {
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

        // Modify to do
        todo.modify = function(listID, todoID, values, callback) {

            var resource = $resource(path + "lists/" + listID + "/todo/" + todoID, {}, {
                modify: {
                    method: 'put',
                    headers: {
                        'x-access-token': $cookies.get("token")
                    }
                }
            });

            var todoValues = {};
            if (values.todo != undefined && values.todo != "") {
                todoValues.todo = values.todo;
            }
            if (values.priority != undefined && values.priority != "") {
                todoValues.priority = values.priority;
            }
            if (values.done != undefined && values.done != "") {
                todoValues.done = values.done;
            }

            resource.modify(todoValues, function (res) {
                callback(res.meta.success, res.meta.message);
            }, function(res) {
                callback(res.data.meta.success, res.data.meta.message);
            });
        };

        // Change to do's done - state
        todo.done = function(listID, todoID, done, callback) {
            var resource = $resource(path + "lists/" + listID + "/todo/" + todoID, {}, {
                modify: {
                    method: 'put',
                    headers: {
                        'x-access-token': $cookies.get("token")
                    }
                }
            });

            resource.modify({done: done}, function (res) {
                callback(res.meta.success, res.meta.message);
            }, function(res) {
                callback(res.data.meta.success, res.data.meta.message);
            });
        };

        return todo;

    }]);
})();