/**
 * Created by valts on 4.10.2016.
 */
(function () {

    var User = require('./models/user');
    var userMod = {};

    // Get user
    userMod.getUser = function (searchParameters, callback) {

        User.findOne(searchParameters, function (err, resUser) {

            if (err || resUser == null) {
                callback({
                    meta: {
                        success: false,
                        status: 401,
                        message: "Invalid username or password"
                    },
                    data: null
                }, null);
            } else {
                callback(null, resUser);
            }
        });
    };

    // Look if user is found with given search parameters
    userMod.isUser = function (searchParameters, callback) {

        // Get user
        User.findOne(searchParameters, function (err, resUser) {

            if (err) {
                callback({
                    meta: {
                        success: false,
                        status: 500,
                        message: "Error"
                    },
                    data: null
                }, null);
            } else {
                if (resUser == null) {
                    callback(null, false);
                } else {
                    callback(null, true);
                }
            }
        });
    };

    // Remove user
    userMod.removeUser = function (userID, callback) {

        User.remove({_id: userID}, function (err) {

            if (err != null) {
                callback({
                    meta: {
                        success: false,
                        status: 500,
                        message: "Error deleting user"
                    },
                    data: null
                });
            } else {
                callback(null);
            }
        });
    };

    module.exports = userMod;
})();