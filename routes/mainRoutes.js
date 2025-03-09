const express = require("express");
const Shirt = require("../models/shirt");
const Pant = require("../models/pant");
const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router({mergeParams:true});

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
router.post("/shirts", async(req,res)=>{
  let newshirt = new Shirt(req.body.shirt);
  await newshirt.save();
  console.log(newshirt);
  res.redirect("/shirts");
})

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
// adding shirt to DB
router.post("/pants", async(req,res)=>{
  let newpant = new Pant(req.body.pant);
  await newpant.save();
  console.log(newpant);
  res.redirect("/pants");
})
module.exports = router;
