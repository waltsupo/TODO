(function() {

    // Get an instance of mongoose
    var mongoose = require('mongoose');

    // Create required schemas
    require('./todo');

    // Create new mongoose.Schema
    var listSchema = mongoose.Schema({
        userID: String,
        name: String,
        todos: [mongoose.model("ToDo").schema]
    });

    // Create model
    var list = mongoose.model('List', listSchema);

    module.exports = list;
})();