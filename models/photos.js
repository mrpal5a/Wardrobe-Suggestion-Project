const mongoose = require("mongoose");
// const Schema = mongoose.Schema
const photoSchema = new mongoose.Schema({
    image:String,
});

const Photo = mongoose.model("Photos", photoSchema);
module.exports = Photo;