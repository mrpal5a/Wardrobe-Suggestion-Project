const mongoose = require("mongoose");
// const Schema = mongoose.Schema
const birthdayPartySchema = new mongoose.Schema({
    image:{
        url:String,
        filename:String,
    },
});

const birthdayPart = mongoose.model("birthdayPart", birthdayPartySchema);
module.exports = birthdayPart;