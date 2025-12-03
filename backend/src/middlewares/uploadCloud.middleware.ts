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
    if (!file) {
      console.log("No file provided in request");
      return next();
    }

    console.log("File received:", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    });

    // Validate file exists
    if (!fs.existsSync(file.path)) {
      return res.status(400).json({
        message: "File not found on server",
        error: "Uploaded file path does not exist",
      });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "dishes_images",
      resource_type: "auto", // Auto detect resource type
    });

    // Log uploaded URL for debugging
    console.log("Cloudinary uploaded successfully:", result.secure_url);

    // Attempt to remove temp file; ignore errors
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      console.warn("Could not remove temp file:", file.path, e);
    }

    // Attach uploaded image URL to request body so controller can save it
    // Use the same field name as the upload field name (dynamic)
    const fieldName = file.fieldname || "image";
    req.body[fieldName] = result.secure_url;

    return next();
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "Upload failed",
      error: error.message || error,
      details: error.error || null,
    });
  }
};
