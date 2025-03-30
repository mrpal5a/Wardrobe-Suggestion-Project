const mongoose = require("mongoose");

const shirtSchema = new mongoose.Schema({
    title:String,
    image:{
        url:String,
        filename:String,
    },
});

const Shirt = mongoose.models.Clothing || mongoose.model("Shirt", shirtSchema);
module.exports = Shirt;
