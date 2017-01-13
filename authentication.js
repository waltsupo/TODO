(function (){

    var jwt = require('jsonwebtoken');
    var User = require('./modules/models/user');
    var bcrypt = require('bcrypt-nodejs');
    var userMod = require('./modules/userMod');
    var config = require('./config'); // get config

    var authentication = {};

    // Check if given username and password allow access to an account
    authentication.login = function (userName, userPass, callback) {

        // Get user with given name
        userMod.getUser({name: userName}, function (err, user) {

            if (err != null) {
                callback({
                    meta: {
                        success: false,
                        status: 401,
                        message: "Invalid username or password"
                    },
                    data: null
                }, null);
            } else {

                // if user found, compare passwords
                bcrypt.compare(userPass, user.password, function (err, result) {
                    if (err) {
                        callback({
                            meta: {
                                success: false,
                                status: 500,
                                message: "Error"
                            },
                            data: null
                        });
                    } else {
                        // If right password, create token and return it
                        if (result) {
                            // Create token
                            var token = jwt.sign({_id: user._id}, config.secret, {
                                expiresIn: 600
                            });

                            callback(null, token);
                        } else {
                            callback({
                                meta: {
                                    success: false,
                                    status: 401,
                                    message: "Invalid username or password"
                                },
                                data: null
                            }, null);
                        }
                    }
                });
            }
        });
    };

    authentication.register = function (userName, userPass, callback) {

        // Look if user with given name already exists
        userMod.isUser({name: userName}, function(err, found) {
            if (err != null) {
                callback(err);
            } else {

                if (found) {
                    callback({
                        meta: {
                            success: false,
                            status: 500,
                            message: "User with given name already exists"
                        },
                        data: null
                    });
                } else {

                    // If username is free, hash the password and create new user
                    bcrypt.hash(userPass, null, null, function (err, result) {

                        if (err) {
                            callback({
                                meta: {
                                    success: false,
                                    status: 500,
                                    message: "Error on creating user"
                                },
                                data: null
                            });
                        } else {

                            // Create new user data
                            var newUser = User({
                                name: userName,
                                password: result,
                                lists: []
                            });

                            // save the user
                            newUser.save(function (err) {
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
                }
            }
        });
    };

    // Verify given token
    authentication.verifyToken = function(token, callback) {

        jwt.verify(token, config.secret, function (err, decoded) {

            if (err) {
                callback({
                    meta: {
                        success: false,
                        status: 401,
                        message: 'Failed to authenticate'
                    },
                    data: null
                }, null);
            } else {
                callback(null, decoded);
            }
        });
    };

    module.exports = authentication;
})();