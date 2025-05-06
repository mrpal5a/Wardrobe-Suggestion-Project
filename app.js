require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mainRoutes = require("./routes/mainRoutes");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/listings"));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
const session = require("express-session");
const flash = require("connect-flash");
app.use(
  session({
    secret: "wardrobe_team_work",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
  })
);
app.use(flash());

// // flash message
// app.use(flash({
//   sessionKeyName: 'express-flash-message',
// }))

//creating flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// Routes
app.use("/", mainRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/wardrobeDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(3000, () => console.log("Server running on port 3000"));
