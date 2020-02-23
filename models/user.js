var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
});
//adds methods to User
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);