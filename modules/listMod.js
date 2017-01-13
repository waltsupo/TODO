(function () {

    var List = require('./models/list');
    var listMod = {};

    // Get list with given ID
    listMod.getList = function (userID, listID, callback) {

        List.findOne({_id: listID}, function (err, list) {

            // If list not found or user doesn't have access to list, return error
            if (err != null || list == null || userID != list.userID) {
                callback({
                    meta: {
                        success: false,
                        status: 404,
                        message: "List not found"
                    },
                    data: null
                }, null);
            } else {
                callback(null, list);
            }
        });
    };

    // Get all lists from user
    listMod.getLists = function (userID, callback) {

        List.find({userID: userID}, function (err, lists) {

            if (err != null || lists == null) {
                callback({
                    meta: {
                        success: false,
                        status: 404,
                        message: "Lists not found"
                    },
                    data: null
                }, null);
            } else {
                callback(null, lists);
            }
        });
    };

    // Add list to database
    listMod.addList = function (userID, listName, callback) {

        if (listName == undefined || listName == "") {
            return callback({
                meta: {
                    success: false,
                    status: 400,
                    message: "List name not defined"
                },
                data: null
            });
        }

        // Create new list
        var list = new List({
            userID: userID,
            name: listName,
            todos: []
        });

        // Save list
        list.save(function (err) {
            if (err) {
                callback({
                    meta: {
                        success: false,
                        status: 500,
                        message: "Error on saving user data"
                    },
                    data: null
                }, null);
            } else {
                callback(null);
            }
        });
    };

    // Remove list from database
    listMod.removeList = function (userID, listID, callback) {

        List.remove({userID: userID, _id: listID}, function (err) {

            if (err != null) {
                callback({
                    meta: {
                        success: false,
                        status: 500,
                        message: "Error deleting list"
                    },
                    data: null
                });
            } else {
                callback(null);
            }
        });
    };

    // Modify list
    listMod.modifyList = function (userID, listID, newName, callback) {

        // If name is invalid, return
        if (newName == undefined || newName == "") {
            return callback({
                meta: {
                    success: false,
                    status: 400,
                    message: "New list name not defined"
                },
                data: null
            });
        }

        // Get list with ID
        listMod.getList(userID, listID, function (err, list) {

            if (err != null) {
                callback(err);
            } else {

                list.name = newName;

                // Save modifications
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

    module.exports = listMod;
})();