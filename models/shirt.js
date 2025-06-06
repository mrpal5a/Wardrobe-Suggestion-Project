const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shirtSchema = new mongoose.Schema({
    title:String,
    dressType:String,
    image:{
        url:String,
        filename:String,
    },
    favorite:{
        type:Boolean,
        default:false,
    },
    owner :{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

const Shirt = mongoose.models.Clothing || mongoose.model("Shirt", shirtSchema);
module.exports = Shirt;
