const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const occasionSchema = new mongoose.Schema({
    title:String,
    occTitle:String,
    image:{
        url:String,
    },
    theme:[
        {
            name: String,  // e.g., "FirstDate", "Interview", etc.
            photos: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Photos",
                },
            ],
        },
    ],
});
const Occasion = mongoose.model("Occasion", occasionSchema);
module.exports = Occasion;