const mongoose = require("mongoose");

const pantSchema = new mongoose.Schema({
    title:String,
    // image:{
    //     type:String,
    //     default: "https://m.media-amazon.com/images/I/61OZ6kPXbzL._AC_UL320_.jpg",
    //     set: (v) => v===""?"https://m.media-amazon.com/images/I/61OZ6kPXbzL._AC_UL320_.jpg":v,
    // },
    dressType:String,
    image:{
        url:String,
        filename:String,
    },
});

const Pant = mongoose.models.Clothing || mongoose.model("Pant", pantSchema);
module.exports = Pant;
