const mongoose = require("mongoose");
// const Schema = mongoose.Schema
const collegePartySchema = new mongoose.Schema({
    image:{
        url:String,
        filename:String,
    },
});

const collegePart = mongoose.model("collegePart", collegePartySchema);
module.exports = collegePart;