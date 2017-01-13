(function() {
    "use strict";

    //Set up variables
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var mongoose = require('mongoose');
    var config = require('./config'); // get config
    var escape = require('html-escape');
    var router = require('./router');
    var auth = require('./authentication');

    // Set up port
    var port = 3000;

    // Connect to database
    mongoose.connect(config.database);
    // Get POST-content
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.use(function(req, res, next) {

        // add few headers to response
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-access-token');

        if (req.method == "OPTIONS") {
            res.status(200).end();
        } else {
            next();
        }
    });

    // Requests
    // Registering new user
    app.post('/register', function (req, res) {

        // Check given values
        var err = null;
        var pat = /^[^\s]{3,}$/;

        if(!req.body.name.match(pat)) {
            err = {
                meta: {
                    success: false,
                    status: 400,
                    message: "Invalid username"
                },
                data: null
            };
        }

        pat = /^[^\s]{6,}$/;
        if (!req.body.password.match(pat)) {
            err = {
                meta: {
                    success: false,
                    status: 400,
                    message: "Invalid password"
                },
                data: null
            };
        }

        // If values are viable, register new user
        if (err != null) {
            res.status(err.meta.status);
            res.json(err);
        } else {
            auth.register(escape(req.body.name), escape(req.body.password), function(err) {

                if (err != null) {
                    res.status(err.meta.status);
                    res.json(err);
                } else {
                    res.status(201);
                    res.json({
                        meta: {
                            success: true,
                            status: 201,
                            message: "New user registered"
                        },
                        data: null
                    });
                }
            });
        }
    });

    // Login to app
    app.post('/login', function (req, res) {

        auth.login(escape(req.body.name), escape(req.body.password), function(err, token) {
            if (err != null) {
                res.status(err.meta.status);
                res.json(err);
            } else {
                res.status(200);
                res.json({
                    meta: {
                        success: true,
                        status: 200,
                        message: "Good login"
                    },
                    data: token
                });
            }
        });
    });

    app.get('/verify', function (req, res) {

        auth.verifyToken(req.body.token || req.params.token || req.headers["x-access-token"], function(err, data) {
            if (err != null) {
                res.status(err.meta.status);
                res.json(err);
            } else {
                res.status(200);
                res.json({
                    meta: {
                        success: true,
                        status: 200,
                        message: "Valid token"
                    },
                    data: null
                });
            }
        });
    });

    // Routes
    app.use('/api', router);

    app.listen(port, function () {});
})();