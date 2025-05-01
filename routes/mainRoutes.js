const mongoose = require("mongoose");
const express = require("express");
const Shirt = require("../models/shirt");
const Pant = require("../models/pant");
const Occasion = require("../models/occasion.js");
const Photos = require("../models/photos.js");
const Interview = require("../models/interview.js");
const BirthdayPart = require("../models/BirthdayParty.js");
const Casual = require("../models/casual.js");
const collegePart =  require("../models/collegeParty.js");
const Concert = require("../models/concert.js");
const FirstDate = require("../models/FirstDate.js");
const SummerWedding = require("../models/summerWedding.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true});
const multer = require("multer")
const {storage} = require("../cloudConfig.js");
// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage });
const {weatherInfo} = require("../middleware.js");
const summerWedding = require("../models/summerWedding.js");
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "94e5b2be896bc5f0d6abe0ad98278b54";

//weatherInfo
router.get("/weatherInfo",  async (req,res)=>{
  res.render("weather.ejs", {result:null, pant:null, shirt:null, outside:null});
})

router.post("/weatherInfo", async (req,res)=>{
  let city = req.body.city || "Ankleshwar";
    try{
      const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      const jsonResponse = await response.json();
    //   console.log(jsonResponse);
      let result = 
      {
          city:jsonResponse.name,
          temp : jsonResponse.main.temp,
          // tempMin : jsonResponse.main.temp_min,
          // tempMax : jsonResponse.main.temp_max,
          // feelsLike :jsonResponse.main.feels_like,
          humidity: jsonResponse.main.humidity,
          weather : jsonResponse.weather[0].description,
          condition:jsonResponse.weather[0].main.toLowerCase(),
      }
      console.log(result);
      let temperature = result.temp;
      let dressType = temperature <= 20 ? "winter" : "summer";
      let outside = dressType == "summer"? "HOT": "COLD";
      const weatherPants = await Pant.find({ dressType });
      const randomPant = weatherPants[Math.floor(Math.random() * weatherPants.length)];
      const weatherShirts = await Shirt.find({ dressType });
      const randomShirt = weatherShirts[Math.floor(Math.random() * weatherShirts.length)];
      res.render("weather.ejs", {result, pant: randomPant, shirt: randomShirt, outside });
  } catch(err){
      throw err;
  }
})

//home route
router.get("/",(req,res)=>res.render("home"));

// router.get("/wearThis", wrapAsync(async (req, res) => {
//   //random pant selection
//   const allpants = await Pant.find({});
//   const idsarray = allpants.map(item => item._id.toString());
//   let num = idsarray.length;
//   num = Math.floor(Math.random()*num);
//   const pantId = idsarray[num];
//   const pant = await Pant.findById(`${pantId}`);
  
//   // random shirt selection
//   const allshirts = await Shirt.find({});
//   const shirtIdarray = allshirts.map(item => item._id.toString());
//   let shirtlen = shirtIdarray.length;
//   shirtlen = Math.floor(Math.random()*shirtlen);
//   const shirtId = shirtIdarray[shirtlen];
//   const shirt = await Shirt.findById(`${shirtId}`);
//   res.render("wearThis",{pant,shirt});
// })
// )

router.get("/wearThis", wrapAsync(async (req, res) => {
  const { dressType } = req.query;
  // console.log(dressType);

  // Random pant of selected dressType
  const pants = await Pant.find({ dressType });
  const randomPant = pants[Math.floor(Math.random() * pants.length)];

  // Random shirt of same dressType
  const shirts = await Shirt.find({ dressType });
  const randomShirt = shirts[Math.floor(Math.random() * shirts.length)];

  if (!randomPant || !randomShirt) {
    return res.send("No matching outfit found for selected dress type.");
  }

  res.render("wearThis", { pant: randomPant, shirt: randomShirt });
}));


// about route
router.get("/about",(req,res)=>{
  res.render("about");
});

// collection route
router.get("/collection", async (req,res)=>{
  const shirts = await Shirt.find({});
  const pants = await Pant.find({});
  res.render("collection.ejs", {shirts, pants});
})

// new collection route
router.get("/newcollection", async (req,res)=>{
  res.render("newcollection.ejs");
})

// shirt show route
router.get(
  "/shirts",
  wrapAsync(async (req, res) => {
    const allshirts = await Shirt.find({});
    res.render("shirt.ejs", { allshirts });
  })
);
// add shirt form
router.get("/addshirt",(req,res)=>{
  res.render("addshirt");
})
// adding shirt to DB
  router.post("/shirts",upload.single("shirt[image]"),  async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
  let newshirt = new Shirt(req.body.shirt);
  newshirt.image = {url,filename};
  await newshirt.save();
  res.redirect("/shirts");
});

//pant show route
router.get(
  "/pants",
  wrapAsync(async (req, res) => {
    const allpants = await Pant.find({});
    res.render("pant.ejs", { allpants });
  })
);
//add pant route
router.get("/addpant", (req,res)=>{
  res.render("addpant.ejs");
})
// adding pants to DB
router.post("/pants", upload.single("pant[image]"), async(req,res)=>{
  let url = req.file.path;
  let filename = req.file.filename;
  let newpant = new Pant(req.body.pant);
  newpant.image = {url,filename};
  await newpant.save();
  res.redirect("/pants");
})

// update shirt details 
router.get("/shirts/:id/edit",async (req,res)=>{
  let {id} = req.params;
  const ThisShirt = await Shirt.findById(id);
  res.render("shirtsEdit.ejs", {ThisShirt});
})

router.put("/shirt/:id",upload.single("shirt[image]"), async (req,res)=>{
  let {id} = req.params;
  const shirt = await Shirt.findByIdAndUpdate(id, { ...req.body.shirt }); 
  console.log(shirt);
  if(typeof req.file !== "undefined"){ // agar user  ne new file upload ki hogi to hi listing ki image ko update krna hai
    let url = req.file.path;
    let filename = req.file.filename;
    shirt.image = {url, filename}; // yeh per hum listing ki image ko upload kr rahe hai or save kr rahe hai
    await shirt.save(); //listing image ko database mai update kr rahe hai
  }
  res.redirect("/shirts")
})

//delete shirt
router.delete("/shirt/:id", async (req,res)=>{
  let {id} = req.params;
  let shirt = await Shirt.findByIdAndDelete(id);
  console.log(shirt);
  res.redirect("/shirts");
})

// update pant details 
router.get("/pants/:id/edit",async (req,res)=>{
  let {id} = req.params;
  const ThisPant = await Pant.findById(id);
  res.render("pantsEdit.ejs", {ThisPant});
})

router.put("/pant/:id",upload.single("pant[image]"), async (req,res)=>{
  let {id} = req.params;
  const pant = await Pant.findByIdAndUpdate(id, { ...req.body.pant }); 
  console.log(pant);
  if(typeof req.file !== "undefined"){ // agar user  ne new file upload ki hogi to hi listing ki image ko update krna hai
    let url = req.file.path;
    let filename = req.file.filename;
    pant.image = {url, filename}; // yeh per hum listing ki image ko upload kr rahe hai or save kr rahe hai
    await pant.save(); //listing image ko database mai update kr rahe hai
  }
  res.redirect("/pants")
})

//delete pant
router.delete("/pant/:id", async (req,res)=>{
  let {id} = req.params;
  let pant = await Pant.findByIdAndDelete(id);
  console.log(pant);
  res.redirect("/pants");
})


//occasion
router.get("/occasion", wrapAsync(async (req,res)=>{
  const allOccasion = await Occasion.find({});
  res.render("occasion.ejs", {allOccasion});
}))

router.get("/occasions/:id", wrapAsync(async(req,res)=>{
  let {id} = req.params;
  console.log(id);
  const occasion = await Occasion.findById(id);
if (!occasion) {
  return res.status(404).send("Occasion not found");
}
let collectionName = occasion.occTitle.toLowerCase() + 's'; // This is probably a string like "FirstDate"
  console.log("Collection name:", collectionName);

  const db = mongoose.connection.db;
  const particularCollection = await db.collection(collectionName).find({}).toArray();
  // const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log("All collections in DB:", collections.map(c => c.name));
  
    // Now you can render it to EJS
    res.render('occasionDetail', { particularCollection, occasion }); // assuming your EJS file is occasions/index.ejs
  }));

//add ocas route 
// for adding clothes to any occasion by just changing the model name
router.get("/addocas", (req,res)=>{
  res.render("addoccasions.ejs");
})

// adding favorite
router.post("/:id/favorite", async (req,res)=>{
  let {id} = req.params;
  let shirtPant = await Pant.findById(id);
  if(shirtPant == null){
    shirtPant = await Shirt.findById(id);
  }
  console.log(shirtPant);
  let favorite = await shirtPant.favorite;
  if(favorite){
    shirtPant.favorite = false;
  }else{
    shirtPant.favorite = true;
  }
  await shirtPant.save();
  console.log(shirtPant.favorite);
  // console.log(favorite);
  res.redirect("/collection");;
})

//showing favorite 
router.get("/favorite", async (req,res)=>{
  const favShirts = await Shirt.find({favorite:true});
  const favPants = await Pant.find({favorite:true});
  res.render("favorite.ejs", {favPants, favShirts});
})

// adding ocassion to DB
router.post("/ocas", upload.single("image"), async (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const { path: url, filename } = req.file;

  // Create new entry with just the image
  let newoccas = new FirstDate({ // just change the model name to add more clothes to that occasion
    image: { url, filename }
  });

  await newoccas.save();
  res.redirect("/addocas");
});


module.exports = router;
