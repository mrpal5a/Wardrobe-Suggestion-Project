const mongoose = require("mongoose");

const shirtSchema = new mongoose.Schema({
    title:String,
    image:{
        type:String,
        default: "https://m.media-amazon.com/images/I/61DGAlvxRLL._AC_UL320_.jpg",
        set: (v) => v===""?"https://m.media-amazon.com/images/I/61DGAlvxRLL._AC_UL320_.jpg":v,
    },
});

const Shirt = mongoose.models.Clothing || mongoose.model("Shirt", shirtSchema);
module.exports = Shirt;
