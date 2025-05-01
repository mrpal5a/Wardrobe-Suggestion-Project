// const occasionsample = [
//     {
//         title:"First Date",
//         image:{
//             url:"https://cdn.lookastic.com/looks/double-breasted-blazer-dress-shirt-chinos-large-1.jpg",
//         }
//     },
//     {
//         title:"Interview",
//         image:{
//             url:"https://cdn.lookastic.com/looks/suit-dress-shirt-desert-boots-large-33.jpg",
//         }
//     },
//     {
//         title:"College Party",
//         image:{
//             url:"https://cdn.lookastic.com/looks/multi-colored-short-sleeve-shirt-khaki-chinos-white-plimsolls-large-20.jpg",
//         }    
//     },
//     {
//         title:"Summer Wedding",
//         image:{
//             url:"https://cdn.lookastic.com/looks/blazer-dress-shirt-dress-pants-large-9.jpg",
//         }    
//     },
//     {
//         title:"Birthday Party",
//         image:{
//             url:"https://cdn.lookastic.com/looks/brown-cardigan-blue-long-sleeve-shirt-khaki-jeans-large-13.jpg",
//         }    
//     },
//     {
//         title:"Concert",
//         image:{
//             url:"https://cdn.lookastic.com/looks/military-jacket-long-sleeve-shirt-jeans-large-18.jpg",
//         }
//     },
//     {
//         title:"Casual",
//         image:{
//             url:"https://cdn.lookastic.com/looks/white-long-sleeve-shirt-black-chinos-burgundy-leather-casual-boots-large-46.jpg",
//         }
//     },
// ]


// module.exports = {occasion:occasionsample};
const mongoose = require("mongoose");
const Occasion = require("../models/occasion.js");
const Photo = require("../models/photos.js");

MONGO_URL = "mongodb://127.0.0.1:27017/wardrobeDB";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Assuming photos are already saved in the Photos collection
const createOccasions = async () => {
    // Find all saved photos
    const photos = await Photo.find();

    // Check if photos are being fetched properly
    // console.log("Fetched photos:", photos);

    // Check if photos array is empty
    if (photos.length === 0) {
        console.log("No photos found in the database.");
        return;
    }

    // Create occasions with proper photo references in the theme
    const occasions = [
        {
            title: "First Date",
            occTitle:"FirstDate",
            image: {
                url: "https://cdn.lookastic.com/looks/double-breasted-blazer-dress-shirt-chinos-large-1.jpg",
            },
            theme: [
                {
                    name: "FirstDate",
                    photos: [photos[0]._id] // Add reference to the photo
                }
            ]
        },
        {
            title: "Interview",
            occTitle:"Interview",
            image: {
                url: "https://cdn.lookastic.com/looks/suit-dress-shirt-desert-boots-large-33.jpg",
            },
            theme: [
                {
                    name: "Interview",
                    photos: [photos[1]._id]
                }
            ]
        },
        {
            title: "College Party",
            occTitle:"collegePart",
            image: {
                url: "https://cdn.lookastic.com/looks/multi-colored-short-sleeve-shirt-khaki-chinos-white-plimsolls-large-20.jpg",
            },
            theme: [
                {
                    name: "CollegeParty",
                    photos: [photos[2]._id]
                }
            ]
        },
        {
            title: "Summer Wedding",
            occTitle:"SummerWedding",
            image: {
                url: "https://cdn.lookastic.com/looks/blazer-dress-shirt-dress-pants-large-9.jpg",
            },
            theme: [
                {
                    name: "SummerWedding",
                    photos: [photos[3]._id]
                }
            ]
        },
        {
            title: "Birthday Party",
            occTitle:"BirthdayPartie",
            image: {
                url: "https://cdn.lookastic.com/looks/brown-cardigan-blue-long-sleeve-shirt-khaki-jeans-large-13.jpg",
            },
            theme: [
                {
                    name: "BirthdayParty",
                    photos: [photos[4]._id]
                }
            ]
        },
        {
            title: "Concert",
            occTitle:"Concert",
            image: {
                url: "https://cdn.lookastic.com/looks/military-jacket-long-sleeve-shirt-jeans-large-18.jpg",
            },
            theme: [
                {
                    name: "Concert",
                    photos: [photos[5]._id]
                }
            ]
        },
        {
            title: "Casual",
            occTitle:"Casual",
            image: {
                url: "https://cdn.lookastic.com/looks/white-long-sleeve-shirt-black-chinos-burgundy-leather-casual-boots-large-46.jpg",
            },
            theme: [
                {
                    name: "Casual",
                    photos: [photos[6]._id]
                }
            ]
        }
    ];

      // Iterate over the occasions array and save each one
      await Occasion.deleteMany({});
      await Occasion.insertMany(occasions);    
    console.log("Occasions created successfully!");
};

createOccasions();
