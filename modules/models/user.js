(function() {

    // Get an instance of mongoose
    var mongoose = require('mongoose');

    // Create new mongoose.Schema
    var userSchema = mongoose.Schema({
        name: String,
        password: String
    });

    // Create model
    var user = mongoose.model('User', userSchema);

    module.exports = user;
})();
