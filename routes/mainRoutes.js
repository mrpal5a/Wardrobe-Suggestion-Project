const mongoose = require("mongoose");
const express = require("express");
// models
const User = require("../models/user.js");
const Shirt = require("../models/shirt");
const Pant = require("../models/pant");
const Occasion = require("../models/occasion.js");
const Photos = require("../models/photos.js");
const Interview = require("../models/occasions/interview.js");
const BirthdayPart = require("../models/occasions/BirthdayParty.js");
const Casual = require("../models/occasions/casual.js");
const collegePart = require("../models/occasions/collegeParty.js");
const Concert = require("../models/occasions/concert.js");
const FirstDate = require("../models/occasions/FirstDate.js");
const SummerWedding = require("../models/occasions/summerWedding.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage });
const { weatherInfo, isAuthenticated } = require("../middleware.js");
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "94e5b2be896bc5f0d6abe0ad98278b54";

const passport = require("passport");

//weatherInfo
router.get("/weatherInfo",isAuthenticated, async (req, res) => {
  res.render("weather.ejs", {
    result: null,
    pant: null,
    shirt: null,
    outside: null,
  });
});

router.post("/weatherInfo",isAuthenticated, async (req, res) => {
  let city = req.body.city || "Ankleshwar";
  try {
    const currUser = req.user;
    const response = await fetch(
      `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );
    const jsonResponse = await response.json();
    //   console.log(jsonResponse);
    let result = {
      city: jsonResponse.name,
      temp: jsonResponse.main.temp,
      // tempMin : jsonResponse.main.temp_min,
      // tempMax : jsonResponse.main.temp_max,
      // feelsLike :jsonResponse.main.feels_like,
      humidity: jsonResponse.main.humidity,
      weather: jsonResponse.weather[0].description,
      condition: jsonResponse.weather[0].main.toLowerCase(),
    };
    console.log(result);
    let temperature = result.temp;
    let dressType = temperature <= 20 ? "winter" : "summer";
    let outside = dressType == "summer" ? "HOT" : "COLD";
    const weatherPants = await Pant.find({ dressType, owner: currUser });
    const randomPant =
      weatherPants[Math.floor(Math.random() * weatherPants.length)];
    const weatherShirts = await Shirt.find({ dressType, owner: currUser });
    const randomShirt =
      weatherShirts[Math.floor(Math.random() * weatherShirts.length)];
    res.render("weather.ejs", {
      result,
      pant: randomPant,
      shirt: randomShirt,
      outside,
    });
  } catch (err) {
    throw err;
  }
});

//home route
router.get("/", (req, res) => res.render("home"));

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

router.get(
  "/wearThis", isAuthenticated,
  wrapAsync(async (req, res) => {
    const { dressType } = req.query;
    // console.log(dressType);
    const currUser = req.user;
    
    // Random pant of selected dressType
    const pants = await Pant.find({ dressType, owner: currUser });
    const randomPant = pants[Math.floor(Math.random() * pants.length)];

    // Random shirt of same dressType
    const shirts = await Shirt.find({ dressType, owner: currUser });
    const randomShirt = shirts[Math.floor(Math.random() * shirts.length)];

    if (!randomPant || !randomShirt) {
      return res.render("NoPairFound.ejs");
    }

    res.render("wearThis", { pant: randomPant, shirt: randomShirt });
  })
);

// about route
router.get("/about", (req, res) => {
  res.render("about");
});

// collection route
router.get("/collection", isAuthenticated, async (req, res) => {
  const currUser = req.user;
  const shirts = await Shirt.find({ owner: currUser });
  const pants = await Pant.find({ owner: currUser });
  if(shirts.length === 0 && pants.length === 0 ){
    return res.render("emptyWardrobe.ejs");
  }
  res.render("collection.ejs", { shirts, pants });
});

// new collection route
router.get("/newcollection",  isAuthenticated,async (req, res) => {
  res.render("newcollection.ejs");
});

// shirt show route
router.get(
  "/shirts", isAuthenticated,
  wrapAsync(async (req, res) => {
    const currUser = req.user;
    // console.log(currUser._id);
    // await Shirt.updateMany({}, { owner: currUser._id });
    // const allshirts = await Shirt.find({});
    // const allshirts = await Shirt.find({ owner: currUser._id });
    const allshirts = await Shirt.find({ owner: currUser._id }).populate("owner");
    // console.log(allshirts);
    res.render("shirt.ejs", { allshirts });
  })
);
// add shirt form
router.get("/addshirt",  isAuthenticated,(req, res) => {
  res.render("addshirt");
});
// adding shirt to DB
router.post("/shirts", upload.single("shirt[image]"), async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let newshirt = new Shirt(req.body.shirt);
  newshirt.image = { url, filename };
  newshirt.owner = req.user._id;
  await newshirt.save();
  req.flash("success", "New shirt added");
  res.redirect("/shirts");
});

//pant show route
router.get(
  "/pants", isAuthenticated,
  wrapAsync(async (req, res) => {
    const currUser = req.user;
    // await Pant.updateMany({}, { owner: currUser._id });
    const allpants = await Pant.find({ owner: currUser._id });
    res.render("pant.ejs", { allpants });
  })
);
//add pant route
router.get("/addpant",  isAuthenticated,(req, res) => {
  res.render("addpant.ejs");
});
// adding pants to DB
router.post("/pants", upload.single("pant[image]"), async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let newpant = new Pant(req.body.pant);
  newpant.image = { url, filename };
  newpant.owner = req.user._id;
  await newpant.save();
  req.flash("success", "New Pant added successfully");
  res.redirect("/pants");
});

// update shirt details
router.get("/shirts/:id/edit", isAuthenticated, async (req, res) => {
  let { id } = req.params;
  const ThisShirt = await Shirt.findById(id);
  res.render("shirtsEdit.ejs", { ThisShirt });
});

// updating the shirt
router.put("/shirt/:id", upload.single("shirt[image]"), async (req, res) => {
  let { id } = req.params;
  const shirt = await Shirt.findByIdAndUpdate(id, { ...req.body.shirt });
  console.log(shirt);
  if (typeof req.file !== "undefined") {
    // agar user  ne new file upload ki hogi to hi listing ki image ko update krna hai
    let url = req.file.path;
    let filename = req.file.filename;
    shirt.image = { url, filename }; // yeh per hum listing ki image ko upload kr rahe hai or save kr rahe hai
    await shirt.save(); //listing image ko database mai update kr rahe hai
  }
  req.flash("success", "Shirt Detail updated successfully");
  res.redirect("/shirts");
});

//delete shirt
router.delete("/shirt/:id", isAuthenticated, async (req, res) => {
  let { id } = req.params;
  let shirt = await Shirt.findByIdAndDelete(id);
  console.log(shirt);
  req.flash("success", "Shirt Deleted");
  res.redirect("/shirts");
});

// update pant details
router.get("/pants/:id/edit",  isAuthenticated,async (req, res) => {
  let { id } = req.params;
  const ThisPant = await Pant.findById(id);
  res.render("pantsEdit.ejs", { ThisPant });
});

// updating the pant
router.put("/pant/:id", isAuthenticated, upload.single("pant[image]"), async (req, res) => {
  let { id } = req.params;
  const pant = await Pant.findByIdAndUpdate(id, { ...req.body.pant });
  console.log(pant);
  if (typeof req.file !== "undefined") {
    // agar user  ne new file upload ki hogi to hi listing ki image ko update krna hai
    let url = req.file.path;
    let filename = req.file.filename;
    pant.image = { url, filename }; // yeh per hum listing ki image ko upload kr rahe hai or save kr rahe hai
    await pant.save(); //listing image ko database mai update kr rahe hai
  }
  req.flash("success", "Pant Details updated successfully");
  res.redirect("/pants");
});

//delete pant
router.delete("/pant/:id", isAuthenticated, async (req, res) => {
  let { id } = req.params;
  let pant = await Pant.findByIdAndDelete(id);
  console.log(pant);
  req.flash("success", "Pant Deleted");
  res.redirect("/pants");
});

//add ocas route
// for adding clothes to any occasion by just changing the model name
router.get("/addocas", (req, res) => {
  res.render("addoccasions.ejs");
});

//occasion
router.get(
  "/occasion", 
  wrapAsync(async (req, res) => {
    const allOccasion = await Occasion.find({});
    res.render("occasion.ejs", { allOccasion });
  })
);

router.get(
  "/occasions/:id", 
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const occasion = await Occasion.findById(id);
    if (!occasion) {
      return res.status(404).send("Occasion not found");
    }
    let collectionName = occasion.occTitle.toLowerCase() + "s"; // This is probably a string like "FirstDate"
    console.log("Collection name:", collectionName);

    const db = mongoose.connection.db;
    const particularCollection = await db
      .collection(collectionName)
      .find({})
      .toArray();
    // const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(
      "All collections in DB:",
      collections.map((c) => c.name)
    );

    // Now you can render it to EJS
    res.render("occasionDetail", { particularCollection, occasion }); // assuming your EJS file is occasions/index.ejs
  })
);


// adding ocassion to DB
router.post("/ocas", upload.single("image"), async (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const { path: url, filename } = req.file;

  // Create new entry with just the image
  let newoccas = new collegePart({
    // just change the model name to add more clothes to that occasion
    image: { url, filename },
  });

  await newoccas.save();
  res.redirect("/addocas");
});
// adding favorite
router.post("/:id/favorite", async (req, res) => {
  let { id } = req.params;
  let shirtPant = await Pant.findById(id);
  if (shirtPant == null) {
    shirtPant = await Shirt.findById(id);
  }
  console.log(shirtPant);
  let favorite = await shirtPant.favorite;
  if (favorite) {
    shirtPant.favorite = false;
  } else {
    shirtPant.favorite = true;
  }
  await shirtPant.save();
  console.log(shirtPant.favorite);
  // console.log(favorite);
  req.flash("success", "Added to Favorite");
  res.redirect("/collection");
});

//showing favorite
router.get("/favorite",  isAuthenticated,async (req, res) => {
  const currUser = req.user;
  const favShirts = await Shirt.find({ favorite: true, owner: currUser });
  const favPants = await Pant.find({ favorite: true, owner: currUser });
  res.render("favorite.ejs", { favPants, favShirts });
});


// search bar
router.post("/search", isAuthenticated, async (req, res) => {
  try {
    const currUser = req.user;
    const searchItem = req.body.clothe;
    const shirts = await Shirt.find({
      $or: [
        { title: { $regex: searchItem, $options: "i" } }, // Search in title
        { dressType: { $regex: searchItem, $options: "i" } }, // Search in dressType
      ], owner:currUser,
    });
    console.log(shirts);
    const pants = await Pant.find({
      $or: [
        { title: { $regex: searchItem, $options: "i" } }, // Search in title
        { dressType: { $regex: searchItem, $options: "i" } }, // Search in dressType
      ], owner:currUser,
    });

    // Format results (lowercase title)
    const formattedShirts = shirts.map((shirt) => ({
      _id: shirt._id,
      title: shirt.title.toLowerCase(),
    }));

    const formattedPants = pants.map((pant) => ({
      _id: pant._id,
      title: pant.title.toLowerCase(),
    }));

    // Check if no items found in both
    if (formattedShirts.length === 0 && formattedPants.length === 0) {
      return res
        .status(404)
        .render("nosearchFound.ejs", {searchItem});
    }
    // storing only ids of found items
    const PantIds = formattedPants.map((item) => item._id);
    const ShirtIds = formattedShirts.map((item) => item._id);
    // searching the items on the basis of ids in both the models
    const foundpants = await Pant.find({ _id: { $in: PantIds } });
    const foundshirts = await Shirt.find({ _id: { $in: ShirtIds } });
    console.log(foundpants);
    console.log(foundshirts);
    res.render("search.ejs", { pants: foundpants, shirts: foundshirts });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//sign up form
router.get("/signup", async (req, res) => {
  res.render("users/signup.ejs");
});

//sign up logic
router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome, ${username}`);
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

// login form
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// login logic
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome back to Wardrobe");
    res.redirect("/");
  }
);

// logout

router.get("/logout", (req,res,next)=>{
  req.logOut(err =>{
    if(err){
      next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/login");
  })
})


// forgot password route
router.get("/forgot-password", (req, res) => {
  res.render("forgot-password"); // make this EJS form
});

// forgot password requirement
const crypto = require("crypto");
const nodemailer = require("nodemailer");
 // forgot password logic

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "No account with that email exists.");
    return res.redirect("/forgot-password");
  }

  // Generate reset token
  const token = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Setup email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "physicspw1@gmail.com",
      pass: "vdjkzrgaoshpzcne",
    }
  });

  const mailOptions = {
    to: user.email,
    from: "physicspw1@gmail.com",
    subject: "Password Reset",
    text: `Click the following link to reset your password:\n\nhttp://${req.headers.host}/reset-password/${token} This email is from Wardrobe Team. Plese Do not reply`
  };

  await transporter.sendMail(mailOptions).catch((err) => {
  console.error("Email failed to send:", err);
  req.flash("error", "Failed to send email. Try again.");
  return res.redirect("/login");
});

});

// password reset token verification
router.get("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash("error", "Password reset token is invalid or has expired.");
    return res.redirect("/forgot-password");
  }

  res.render("reset-password", { token: req.params.token });
});

// handle new password submission
router.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash("error", "Token is invalid or expired.");
    return res.redirect("/forgot-password");
  }

  const { password } = req.body;
 await user.setPassword(password);
// await user.save();
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  req.flash("success", "Your password has been reset. Please login.");
  res.redirect("/login");
});


//not found page
router.use("*", (req, res) => {
  res.status(404).render("NotFound.ejs");
});

module.exports = router;
