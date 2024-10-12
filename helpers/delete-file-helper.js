const fs = require("fs").promises;
const path = require("path");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

//------------------------------- File Deletion from Server -------------------------------

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log("File Deleted Successfully");
  } catch (error) {
    console.log("Error Deleting File:", error.message);
  }
};

//------------------------------- Cloudinary Configuration ---------------------------

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_SECRET_KEY,
});

/**
 * Helper function to extract the public ID from a Cloudinary URL.
 * @param {string} url - The full URL of the Cloudinary resource.
 * @returns {string} - The public ID extracted from the URL.
 */
const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const publicIdWithVersion = parts.slice(-2).join("/");
  // Remove the file extension and version to get the public ID
  const publicId = publicIdWithVersion
    .split(".")[0]
    .split("/")
    .slice(1)
    .join("/");
  return publicId;
};

// Function to delete a single file from Cloudinary
const deleteCloudSingle = async (imageUrl) => {
  try {
    const publicId = getPublicIdFromUrl(imageUrl);

    if (!publicId) {
      throw new Error("Invalid image URL.");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      console.log("Asset deleted successfully from Cloudinary.");
    } else {
      console.error("Error: Could not delete the asset from Cloudinary.");
    }
  } catch (error) {
    console.error("Error Deleting Cloudinary Asset:", error.message);
  }
};

// Function to delete multiple files from Cloudinary
const deleteCloudMultiple = async (imageUrls) => {
  try {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error("Invalid image URLs.");
    }

    // Extract public IDs from the URLs
    const publicIds = imageUrls.map(getPublicIdFromUrl);

    // Delete each asset using a loop
    for (const publicId of publicIds) {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== "ok") {
        console.error(`Error deleting asset with public ID: ${publicId}`);
      }
    }

    console.log("Assets deleted successfully from Cloudinary.");
  } catch (error) {
    console.error("Error Deleting Cloudinary Assets:", error.message);
  }
};

module.exports = { deleteFile, deleteCloudSingle, deleteCloudMultiple };
