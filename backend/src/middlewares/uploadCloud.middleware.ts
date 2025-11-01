import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// 🔧 Cấu hình Cloudinary bằng biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req, res) => {
  try {
    // Lấy đường dẫn file mà multer upload tạm vào server
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "test_upload", // tùy chọn: thư mục trong Cloudinary
    });
    // Xóa file tạm sau khi upload xong
    fs.unlinkSync(file.path);

    // Trả về kết quả
    res.status(200).json({
      message: "Upload successful",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};
