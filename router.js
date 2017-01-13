(function() {
    "use strict";

    var express = require('express');
    var app = express();
    var apiRoutes = express.Router();
    var auth = require('./authentication');
    var bodyParser = require('body-parser');
    var escape = require('html-escape');
    var listMod = require('./modules/listMod');
    var todoMod = require('./modules/todoMod');

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // Middleware to verify token
    apiRoutes.use(function (req, res, next) {

        // Get token
        var token = req.body.token || req.params.token || req.headers["x-access-token"];

        // If found, verify it
        if (token) {

            auth.verifyToken(token, function (err, decoded) {
                if (err != null) {
                    res.status(err.meta.status);
                    res.json(err);
                } else {
                    if (decoded && decoded._id != undefined) {
                        req.decoded = decoded;
                        next();
                    } else {
                        res.status(401);
                        res.json({
                            meta: {
                                success: false,
                                status: 401,
                                message: "Token doesn't contain anything"
                            },
                            data: null
                        });
                    }
                }
            });
        } else {
            res.status(401);
            res.json({
                meta: {
                    success: false,
                    status: 401,
                    message: "Failed to authenticate"
                },
                data: null
            });
        }
    });

    // Lists
    // Get all lists from user
    apiRoutes.get('/lists', function (req, res) {

        listMod.getLists(req.decoded._id, function (err, lists) {
            if (err != null) {
                res.status(err.meta.status);
                res.json(err);
            } else {
                res.status(200);
                res.json({
                    meta: {
                        success: true,
                        status: 200,
                        message: "Lists found"
                    },
                    data: lists
                });
            }
        });
    });

    // List
    // Get list with ID
    apiRoutes.get('/lists/:listID', function (req, res) {

        listMod.getList(req.decoded._id, escape(req.params.listID), function (err, list) {
            if (err != null) {
                res.status(err.meta.status);
                res.json(err);
            } else {
                res.status(200);
                res.json({
                    meta: {
                        success: true,
                        status: 200,
                        message: "List found"
                    },
                    data: list
                });
            }
        });
    });

    // Add new list
    apiRoutes.post('/lists', function (req, res) {

        listMod.addList(req.decoded._id, escape(req.body.listName), function(err) {
            if (err != null) {
                res.status(err.meta.status);
                res.json(err);
            } else {
                res.status(201);
                res.json({
                    meta: {
                        success: true,
                        status: 201,
                        message: "Lists added"
                    },
                    data: null
                });
            }
        });
    });

    // Delete list with ID
    apiRoutes.delete('/lists/:listID', function (req, res) {

        listMod.removeList(req.decoded._id, escape(req.params.listID), function(err) {
            if (err != null) {
                res.status(err.meta.status);
                res.json(err);
            } else {
                res.status(200);
                res.json({
                    meta: {
                        success: true,
                        status: 200,
                        message: "List deleted"
                    },
                    data: null
                });
            }
        });
    });

    // Modify list with ID
    apiRoutes.put('/lists/:listID', function (req, res) {

        listMod.modifyList(req.decoded._id, escape(req.params.listID), escape(req.body.newName), function(err) {
            if (err != null) {
                res.status(err.meta.status);
                res.json(err);
            } else {
                res.status(200);
                res.json({
                    meta: {
                        success: true,
                        status: 200,
                        message: "Lists modified"
                    },
                    data: null
                });
            }
        });
    });

    // TODOs
    // Get with todoID from list with listID
    apiRoutes.get('/lists/:listID/todo/:todoID', function (req, res) {

        todoMod.getTodo(req.decoded._id, escape(req.params.listID), escape(req.params.todoID), function(err, todo) {
            if (err != null) {
                res.status(err.meta.status);
                res.json(err);
            } else {
                res.status(200);
                res.json({
                    meta: {
                        success: true,
                        status: 200,
                        message: "Todo found"
                    },
                    data: todo
                });
            }
        });
    });

    // Add new to list with listID
    apiRoutes.post('/lists/:listID/todo', function (req, res) {

        var todoValues = {
            todo: escape(req.body.todo),
            priority: escape(req.body.priority),
            done: escape(req.body.done)
        };

        todoMod.addTodo(req.decoded._id, escape(req.params.listID), todoValues, function(err) {
            if (err != null) {
                res.status(err.meta.status);
                res.json(err);
            } else {
                res.status(201);
                res.json({
                    meta: {
                        success: true,
                        status: 201,
                        message: "Todo added"
                    },
                    data: null
                });
            }
        });
    });

    // Delete from list
    apiRoutes.delete('/lists/:listID/todo/:todoID', function (req, res) {

       todoMod.removeTodo(req.decoded._id, escape(req.params.listID), escape(req.params.todoID), function(err) {
           if (err != null) {
               res.status(err.meta.status);
               res.json(err);
           } else {
               res.status(200);
               res.json({
                   meta: {
                       success: true,
                       status: 200,
                       message: "Todo deleted"
                   },
                   data: null
               });
           }
        });
    });

    // Modify
    apiRoutes.put('/lists/:listID/todo/:todoID', function (req, res) {

        var todoValues = {
            todo: escape(req.body.todo),
            priority: escape(req.body.priority),
            done: escape(req.body.done)
        };

        todoMod.modifyTodo(req.decoded._id, escape(req.params.listID), escape(req.params.todoID), todoValues, function(err) {
            if (err != null) {
                res.status(err.meta.status);
                res.json(err);
            } else {
                res.status(200);
                res.json({
                    meta: {
                        success: true,
                        status: 200,
                        message: "Todo modified"
                    },
                    data: null
                });
            }
        });
    });

    module.exports = apiRoutes;
})();