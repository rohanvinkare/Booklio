const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
require("dotenv").config();
//----------------------- TO upload file on the cloud -------------

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_SECRET_KEY,
});

//--------------------------------
const uploadCloudMultiple = asyncHandler(async (req, res, next) => {
  try {
    const images = req.files;
    console.log(images);

    const imageUrls = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });

      imageUrls.push(result.secure_url);
    }

    req.images = imageUrls;
    console.log(req.images);

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(`Internal error at : uploadMUltiple.js - ${error}`);
  }
});

//-------------------------------------------
const uploadCloudSingle = asyncHandler(async (req, res, next) => {
  try {
    const image = req.file;
    console.log(image);

    const result = await cloudinary.uploader.upload(image.path, {
      resource_type: "auto",
    });

    req.image = result.secure_url;

    console.log(req.image);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(`Internal error at : uploadMUltiple.js - ${error}`);
  }
});

//------------------------- To delete

module.exports = { uploadCloudMultiple, uploadCloudSingle };
