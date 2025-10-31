const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

require("dotenv").config(); // load biến môi trường từ .env

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
});
// end cấu hình Cloudinary
module.exports.uploadToCloud = (req, res, next) => {
  console.log("req.file:", req.file);
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            console.log("Lỗi upload:", error);
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log("Result từ Cloudinary:", result);
      console.log("URL ảnh:", result.secure_url);

      req.body[req.file.fieldname] = result.secure_url;
      next();
    }

    upload(req);
  } else {
    next();
  }
};
