const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new mongoose.Schema({
    pseudo: String,
    username: String,
    userlastname: String,
    userheight: Number,
    userweight: Number,
    userborn: Date,
    password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);