// this file is just created for inserting the initial data to the database
const mongoose = require("mongoose");
const shirtData = require("./shirtData.js");
const Shirt = require("../models/shirt.js");
const pantData = require("./pantData.js");
const Pant = require("../models/pant.js");

MONGO_URL = "mongodb://127.0.0.1:27017/wardrobeDB";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const shirtinitDB = async ()=>{
    await Shirt.deleteMany({});
    await Shirt.insertMany(shirtData.shirt);
    console.log("data is initialized")
};
shirtinitDB();

const pantinitDB = async ()=>{
    await Pant.deleteMany({});
    await Pant.insertMany(pantData.pant);
    console.log("data is initialized")
};
pantinitDB();