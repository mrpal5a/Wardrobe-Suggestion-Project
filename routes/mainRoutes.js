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
router.get("/", (req,res)=>{
  res.render("home");
})
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
module.exports = router;
