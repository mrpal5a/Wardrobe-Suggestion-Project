require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mainRoutes = require("./routes/mainRoutes");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const passport = require("passport");
const LocalStrategy = require("passport-local")
// Middleware
const User = require("./models/user")
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/listings"));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
  secret: "wardrobe_team_work",
    resave: false,
    saveUninitialized: true,
    cookie:{
      expires: Date.now() + 1000*60*60*24*3,
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly:true,
    }
}
app.use(
  session(sessionOptions)
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// user authenticate
passport.serializeUser(User.serializeUser()); // user details store in session
passport.deserializeUser(User.deserializeUser()); // user details remove from session

//creating flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
// Routes
app.use("/", mainRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/wardrobeDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(3000, () => console.log("Server running on port 3000"));
