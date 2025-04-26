const express = require("express");
const Shirt = require("../models/shirt");
const Pant = require("../models/pant");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true});
const multer = require("multer")
const {storage} = require("../cloudConfig.js");
// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage });


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
  console.log(dressType);

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
module.exports = router;
