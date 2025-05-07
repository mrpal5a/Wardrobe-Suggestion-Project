const mongoose = require("mongoose");
// const Schema = mongoose.Schema
const casualSchema = new mongoose.Schema({
    image:{
        url:String,
        filename:String,
    },
});

const casual = mongoose.model("casual", casualSchema);
module.exports = casual;