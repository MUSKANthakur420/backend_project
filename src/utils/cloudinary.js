import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "users",
    });

    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    return response;
  } catch (error) {
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  if (!publicId) return null;

  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    throw new Error("Cloudinary delete failed: " + error.message);
  }
};

export {
  uploadFileOnCloudinary,
  deleteFromCloudinary,
};