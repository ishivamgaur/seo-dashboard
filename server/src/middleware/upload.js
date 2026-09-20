import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { ApiError } from "../utils/ApiError.js";
import { config } from "../config/environment.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
  const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        "Invalid file type. Only JPG, JPEG, PNG, GIF, and WEBP images are allowed."
      )
    );
  }
};

const createStorage = (subfolder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `seo-dashboard/${subfolder}`,
      allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
  });
};

const createUploader = (subfolder = "") => {
  return multer({
    storage: createStorage(subfolder),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
};

const heroUpload = createUploader("hero");
const vehicleUpload = createUploader("vehicles");
const occasionUpload = createUploader("occasions");
const testimonialUpload = createUploader("testimonials");
const galleryUpload = createUploader("gallery");

export {
  createUploader,
  heroUpload,
  vehicleUpload,
  occasionUpload,
  testimonialUpload,
  galleryUpload,
};
export default createUploader;
