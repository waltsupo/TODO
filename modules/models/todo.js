(function() {

    // Get an instance of mongoose
    var mongoose = require('mongoose');

    // Create new mongoose.Schema
    var toDoSchema = mongoose.Schema({
        todo: String,
        priority: Number,
        done: Boolean
    });

    // Create model
    var toDO = mongoose.model('ToDo', toDoSchema);

    module.exports = toDO;
})();