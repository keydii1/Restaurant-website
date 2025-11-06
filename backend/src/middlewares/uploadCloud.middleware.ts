import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

dotenv.config();

// Configure Cloudinary using env vars from project .env (CLOUD_NAME, API_KEY, API_SECRET)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.API_SECRET || process.env.CLOUDINARY_API_SECRET,
});

// Middleware: upload file to Cloudinary, attach URL to req.body.image, then call next()
export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = (req as any).file;

    // If no file provided, continue to controller (controller may accept requests without an image)
    if (!file) return next();

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "dishes_images",
    });

    // Log uploaded URL for debugging
    console.log("Cloudinary uploaded URL:", result.secure_url);

    // Attempt to remove temp file; ignore errors
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      console.warn("Could not remove temp file:", file.path, e);
    }

    // Attach uploaded image URL to request body so controller can save it
    (req as any).body = (req as any).body || {};
    (req as any).body.image = result.secure_url;

    return next();
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error });
  }
};
