const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    //we will not add username and password to the schema because that will be automatically done by passport-local-mongoose
});

userSchema.plugin(passportLocalMongoose); // this will add automatically username and password

module.exports = mongoose.model("User", userSchema);