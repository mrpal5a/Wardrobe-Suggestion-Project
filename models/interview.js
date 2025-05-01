const mongoose = require("mongoose");
// const Schema = mongoose.Schema
const InterviewSchema = new mongoose.Schema({
    image:{
        url:String,
        filename:String,
    },
});

const Interview = mongoose.model("Interview", InterviewSchema);
module.exports = Interview;