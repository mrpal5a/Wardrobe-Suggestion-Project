const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD__API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  //all the keys assigned are default means we always have to give this key always i.e cloud_name, api_key and api_secret. We always have to write this but after the process.env.VARIABLE_NAME that can be anything that we had declared in the .env file
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wardrobe_DEVELOPMENT",
    //   format: async (req, file) => 'png', // supports promises as well
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});

module.exports = {
    storage,
    cloudinary,
}
