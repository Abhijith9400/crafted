// backend/config/cloudinaryStorage.js
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "crafted_learning_exams",
    resource_type: "raw", // IMPORTANT for PDFs
    allowed_formats: ["pdf"],
  },
});

const upload = multer({ storage });

module.exports = upload;
