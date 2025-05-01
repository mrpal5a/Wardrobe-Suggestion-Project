const mongoose = require("mongoose");
// const Schema = mongoose.Schema
const summerWeddingSchema = new mongoose.Schema({
    image:{
        url:String,
        filename:String,
    },
});

const summerWedding = mongoose.model("summerWedding", summerWeddingSchema);
module.exports = summerWedding;