const mongoose = require("mongoose");
// const Schema = mongoose.Schema
const concertSchema = new mongoose.Schema({
    image:{
        url:String,
        filename:String,
    },
});

const concert = mongoose.model("concert", concertSchema);
module.exports = concert;