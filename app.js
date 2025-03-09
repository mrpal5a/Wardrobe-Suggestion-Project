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
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", mainRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/wardrobeDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(3000, () => console.log("Server running on port 3000"));
