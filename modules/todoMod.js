(function () {

    var listMod = require('./listMod');
    var ToDo = require('./models/todo');
    var todoMod = {};

    // Get one
    todoMod.getTodo = function (userID, listID, todoID, callback) {

        listMod.getList(userID, listID, function (err, list) {

            if (err != null) {
                callback(err, null);
            } else {
                var found = false;

                for (var i = 0; i < list.todos.length; i++) {
                    if (list.todos[i]._id == todoID) {
                        callback(null, list.todos[i]);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    callback({
                        meta: {
                            success: false,
                            status: 404,
                            message: "ToDo not found"
                        },
                        data: null
                    }, null);
                }
            }
        });
    };

    // Add new
    todoMod.addTodo = function (userID, listID, todoValues, callback) {

        var prioPat = /^[0-9]+$/;
        var valid = true;

        if (todoValues.todo == undefined || todoValues.todo == "") {
            valid = false;
        }

        if (todoValues.priority == undefined || todoValues.priority == "" || !prioPat.test(todoValues.priority) ||
            parseInt(todoValues.priority) < 1 || parseInt(todoValues.priority) > 10) {
            valid = false;
        }

        if (todoValues.done == undefined || !(todoValues.done == "false" || todoValues.done == "true")) {
            valid = false;
        }

        if (!valid) {
            return callback({
                meta: {
                    success: false,
                    status: 400,
                    message: "Required values are missing or invalid"
                },
                data: null
            });
        }

        listMod.getList(userID, listID, function (err, list) {

            if (err != null) {
                callback(err);
            } else {

                // Create new
                var todo = ToDo({
                    todo: todoValues.todo,
                    priority: todoValues.priority,
                    done: todoValues.done
                });

                list.todos.push(todo);
                list.save(function (err) {
                    if (err) {
                        callback({
                            meta: {
                                success: false,
                                status: 500,
                                message: "Error on saving user data"
                            },
                            data: null
                        });
                    } else {
                        callback(null);
                    }
                });
            }
        });
    };

    // Remove to do
    todoMod.removeTodo = function (userID, listID, todoID, callback) {

        listMod.getList(userID, listID, function (err, list) {

            if (err != null) {
                callback(err);
            } else {
                var found = false;

                for (var i = 0; i < list.todos.length; i++) {

                    if (list.todos[i]._id == todoID) {

                        found = true;
                        list.todos.splice(i, 1);

                        // Save changes
                        list.save(function (err) {
                            if (err) {
                                callback({
                                    meta: {
                                        success: false,
                                        status: 500,
                                        message: "Error on saving user data"
                                    },
                                    data: null
                                });
                            } else {
                                callback(null);
                            }
                        });

                        break;
                    }
                }

                if (!found) {
                    callback({
                        meta: {
                            success: false,
                            status: 404,
                            message: "ToDo not found"
                        },
                        data: null
                    });
                }
            }
        });
    };

    // Modify values
    todoMod.modifyTodo = function (userID, listID, todoID, todoValues, callback) {

        listMod.getList(userID, listID, function (err, list) {

            if (err != null) {
                callback(err);
            } else {

                var index = null;
                for (var i = 0; i < list.todos.length; i++) {

                    if (list.todos[i]._id == todoID) {

                        index = i;
                        break;
                    }
                }

                if (index != null) {

                    var prioPat = /^[0-9]+$/;

                    if (todoValues.todo != undefined && todoValues.todo != "") {
                        list.todos[index].todo = todoValues.todo;
                    }

                    if (todoValues.priority != undefined && todoValues.priority != "" && prioPat.test(todoValues.priority) &&
                        parseInt(todoValues.priority) >= 1 && parseInt(todoValues.priority) <= 10) {
                        list.todos[index].priority = todoValues.priority;
                    }

                    if (todoValues.done != undefined && (todoValues.done == "false" || todoValues.done == "true")) {
                        list.todos[index].done = todoValues.done;
                    }

                    list.save(function (err) {
                        if (err) {
                            callback({
                                meta: {
                                    success: false,
                                    status: 500,
                                    message: "Error on saving user data"
                                },
                                data: null
                            });
                        } else {
                            callback(null);
                        }
                    });
                } else {
                    callback({
                        meta: {
                            success: false,
                            status: 404,
                            message: "Todo not found"
                        },
                        data: null
                    });
                }
            }
        });
    };

    module.exports = todoMod;
})();