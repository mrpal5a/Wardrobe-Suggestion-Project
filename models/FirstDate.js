const mongoose = require("mongoose");
// const Schema = mongoose.Schema
const firstDateSchema = new mongoose.Schema({
    image:{
        url:String,
        filename:String,
    },
});

const FirstDate = mongoose.model("FirstDate", firstDateSchema);
module.exports = FirstDate;