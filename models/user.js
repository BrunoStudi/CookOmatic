const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    pseudo: String,
    username: String,
    userlastname: String,
    //userheight: Number,
    //userweight: Number,
    //userborn: Date,
    password: String
});

module.exports = mongoose.model("User", userSchema);