import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file
const uploadFileOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    console.log("Uploading file to Cloudinary:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "users",
    });

    // Delete temp file after upload
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

// Delete file
const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  if (!publicId) return null;

  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    console.log("Cloudinary delete success:", response);

    return response;
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    throw new Error("Cloudinary delete failed: " + error.message);
  }
};

export {
  uploadFileOnCloudinary,
  deleteFromCloudinary,
};