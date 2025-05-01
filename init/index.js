// this file is just created for inserting the initial data to the database
const mongoose = require("mongoose");
const shirtData = require("./shirtData.js");
const Shirt = require("../models/shirt.js");
const pantData = require("./pantData.js");
const Pant = require("../models/pant.js");
const OccasionData = require("./occasionData.js");
const Occasion = require("../models/occasion.js");
const PhotoData = require("./photosData.js");
const Photo = require("../models/photos.js");

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
    const updatedShirtData = shirtData.shirt.map(shirt =>({
        ...shirt, 
        favorite:false, // adding the favorite
    }));
    await Shirt.insertMany(updatedShirtData);
    console.log("Data is initialized with 'favourite' attribute");
};
// shirtinitDB();

const pantinitDB = async () => {
    await Pant.deleteMany({});

    const updatedPantData = pantData.pant.map(pant => ({
        ...pant,
        favourite: false // add the new field
    }));

    await Pant.insertMany(updatedPantData);
    console.log("Data is initialized with 'favourite' attribute");
};

// pantinitDB();

const occasioninitDB = async ()=>{
    await Occasion.deleteMany({});
    await Occasion.insertMany(OccasionData.occasion);
    console.log("data is initialized")
};
// occasioninitDB();

// Add photos to the database
const addPhotos = async () => {
    await Photo.deleteMany({});
    await Photo.insertMany(PhotoData.photo);
    console.log("Photos saved successfully!");
};

// Call this function to save photos
// addPhotos();
