/**
 * Created by valts on 11.10.2016.
 */
(function () {

    var app = angular.module('app');

    app.controller("ListsCtrl", function ($scope, $rootScope, $resource, $cookies, Lists, Todo) {

        // If no token is found, move to login
        if ($cookies.get("token") == undefined) {
            location.href="#/login";
        }

        // If user is editing something
        $scope.editOn = false;
        // User is logged in
        $rootScope.logged = true;
        // Sorting parameter
        $scope.sortParam = "todo";
        // Sorting direction
        $scope.desc = true;
        // Lists and if they are open or not
        $scope.openLists = [];
        // List sorting direction
        $scope.listDesc = true;

        // ID's of currently edited list and to do
        var editLID = null;
        var editTID = null;

        // Get all lists and save those
        Lists.getAll(function(message, data) {
            // If invalid token, return to login
            if (message == "Failed to authenticate") {
                location.href = "#/login";
            }

            if (data != null) {
                $scope.lists = data;

                for (var index = 0; index < $scope.lists.length; index++) {
                    $scope.openLists.push({listID: $scope.lists[index]._id, open: false});
                }
            }
        });

        // Show modal to ask values
        $scope.showModal = function (modal, listID, todoID, editOn) {

            $scope.editOn = editOn;
            editLID = listID;
            editTID = todoID;

            // Reset values
            $scope.listNameM = "";
            $scope.todo = "";
            $scope.priority = "";
            // Show modal
            $(modal).modal();
        };

        // Edit to do
        $scope.editTodo = function () {

            // If editON is true, edit to do, else create new
            if ($scope.editOn) {
                Todo.modify(editLID, editTID, {todo: $scope.todo, priority: $scope.priority}, function (success, message) {
                    if (success) {
                        // If success, update list
                        Lists.get(editLID, function(message, data) {
                            if (data != null) {
                                for (var index = 0; index < $scope.lists.length; index++) {
                                    if ($scope.lists[index]._id == editLID) {
                                        $scope.lists[index] = data;
                                    }
                                }
                                $('#todoModal').modal('hide');
                            }
                        });
                    } else {
                        // If invalid token, return to login
                        if (message == "Failed to authenticate") {
                            location.href = "#/login";
                        }
                    }
                });
            } else {
                $scope.addTodo();
            }
        };

        // Add new to do
        $scope.addTodo = function() {

            Todo.add(editLID, {todo: $scope.todo, priority: $scope.priority}, function(success, message) {
                if (success) {
                    // Update list
                    Lists.get(editLID, function(message, data) {
                        if (data != null) {
                            for (var index = 0; index < $scope.lists.length; index++) {
                                if ($scope.lists[index]._id == editLID) {
                                    $scope.lists[index] = data;
                                }
                            }
                            $('#todoModal').modal('hide');
                        }
                    });
                } else {
                    // If invalid token, return to login
                    if (message == "Failed to authenticate") {
                        location.href = "#/login";
                    }
                }
            });
        };

        // Remove to do
        $scope.removeTodo = function (){

            Todo.remove(editLID, editTID, function(success, message) {
                if (success) {
                    Lists.get(editLID, function(message, data) {
                        if (data != null) {
                            for (var index = 0; index < $scope.lists.length; index++) {
                                if ($scope.lists[index]._id == editLID) {
                                    $scope.lists[index] = data;
                                }
                            }
                            $('#todoModal').modal('hide');
                        }
                    });
                } else {
                    // If invalid token, return to login
                    if (message == "Failed to authenticate") {
                        location.href = "#/login";
                    }
                }
            });
        };

        // Rename or create new list
        $scope.editList = function () {

            if ($scope.editOn) {
                Lists.rename(editLID, $scope.listNameM, function (success, message) {
                    if (success) {

                        for (var index = 0; index < $scope.lists.length; index++) {

                            if ($scope.lists[index]._id == editLID) {
                                $scope.lists[index].name = $scope.listNameM;
                                $('#listModal').modal('hide');
                                break;
                            }
                        }
                        $scope.listNameM = "";
                    } else {
                        // If invalid token, return to login
                        if (message == "Failed to authenticate") {
                            location.href = "#/login";
                        }
                    }
                });
            } else {
                $scope.addList();
            }
        };

        // Remove list
        $scope.removeList = function (){

            Lists.remove(editLID, function(success, message) {
               if (success) {
                   remIndex = null;

                   for (var index = 0; index < $scope.lists.length; index++) {

                       if ($scope.lists[index]._id == editLID) {
                           remIndex = index;
                       }
                   }

                   if (remIndex != null) {
                       $scope.lists.splice(remIndex, 1);
                   }
               } else {
                   // If invalid token, return to login
                   if (message == "Failed to authenticate") {
                       location.href = "#/login";
                   }
               }
            });
        };

        // Add list
        $scope.addList = function (){

            Lists.add($scope.listNameM, function(success, message) {
                if (success) {
                    Lists.getAll(function(message, data) {
                        if (data != null) {
                            $scope.lists = data;

                            for (var index = 0; index < $scope.lists.length; index++) {
                                $scope.openLists.push({listID: $scope.lists[index]._id, open: false});
                            }
                            $scope.listNameM = "";
                            $('#listModal').modal('hide');
                        }
                    });
                } else {
                    // If invalid token, return to login
                    if (message == "Failed to authenticate") {
                        location.href = "#/login";
                    }
                }
            });
        };

        // Sort to dos
        $scope.sort = function (variable) {

            if (variable != $scope.sortParam) {
                $scope.sortParam = variable;
                $scope.desc = true;
            } else {
                if ($scope.desc)
                    $scope.desc = false;
                else
                    $scope.desc = true;
            }
        };

        // Sort lists
        $scope.sortLists = function () {
            if ($scope.listDesc)
                $scope.listDesc = false;
            else
                $scope.listDesc = true;
        };

        // Change done - state
        $scope.done = function (listID, todoID) {

            var newDone = false;

            for (var index = 0; index < $scope.lists.length; index++) {

                if ($scope.lists[index]._id == listID) {

                    for (var index2 = 0; index2 < $scope.lists[index].todos.length; index2++) {

                        if ($scope.lists[index].todos[index2]._id == todoID) {

                            newDone = !$scope.lists[index].todos[index2].done;

                            Todo.done(listID, todoID, newDone, function(success, message) {
                                if (success) {

                                    $scope.lists[index].todos[index2].done = newDone;
                                    console.log($scope.lists[index].todos[index2].done);
                                } else {
                                    // If invalid token, return to login
                                    if (message == "Failed to authenticate") {
                                        location.href = "#/login";
                                    }
                                }
                            });

                            break;
                        }
                    }
                    break;
                }
            }
        };

        // Open list
        $scope.open = function (id) {

            for (var index = 0; index < $scope.openLists.length; index++) {
                if ($scope.openLists[index].listID == id) {

                    if ($scope.openLists[index].open) {
                        $scope.openLists[index].open = false;
                    } else {
                        $scope.openLists[index].open = true;
                    }
                }
            }
        };

        // if list is collapsed
        $scope.collapsed = function (id) {

            for (var index = 0; index < $scope.openLists.length; index++) {
                if ($scope.openLists[index].listID == id) {
                    return $scope.openLists[index].open;
                }
            }
            return false;
        };
    });
})();