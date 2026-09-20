import path from "path";
import multer from "multer";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

import { ApiError } from "../utils/ApiError.js";
import { config } from "../config/environment.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Output size and quality per use case: avatars stay tiny and fast,
// showcase photos keep enough pixels for full-width display.
const PRESETS = {
  avatar: { width: 256, height: 256, fit: "cover", quality: 80 },
  standard: { width: 1600, height: 1600, fit: "inside", quality: 82 },
};

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

const optimizeBuffer = async (buffer, mimetype, preset) => {
  const image = sharp(buffer).rotate();
  if (mimetype === "image/gif") return image.toBuffer();
  image.resize({
    width: preset.width,
    height: preset.height,
    fit: preset.fit,
    withoutEnlargement: true,
  });
  if (mimetype === "image/png") return image.png({ compressionLevel: 8 }).toBuffer();
  if (mimetype === "image/webp") return image.webp({ quality: preset.quality }).toBuffer();
  return image.jpeg({ quality: preset.quality, mozjpeg: true }).toBuffer();
};

const uploadBuffer = (buffer, subfolder, mimetype) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `seo-dashboard/${subfolder}`,
        resource_type: "image",
        format: mimetype.split("/")[1] === "jpeg" ? "jpg" : mimetype.split("/")[1],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

// Multer storage engine: holds the file in memory, optimizes it with
// sharp, then streams it to Cloudinary. Exposes req.file(s) with a
// `path` holding the secure url, exactly like before.
const createOptimizedStorage = (subfolder, presetName = "standard") => ({
  _handleFile(req, file, cb) {
    const chunks = [];
    file.stream.on("data", (chunk) => chunks.push(chunk));
    file.stream.on("error", (err) => cb(err));
    file.stream.on("end", async () => {
      try {
        const preset = PRESETS[presetName] || PRESETS.standard;
        const optimized = await optimizeBuffer(Buffer.concat(chunks), file.mimetype, preset);
        const result = await uploadBuffer(optimized, subfolder, file.mimetype);
        cb(null, {
          destination: subfolder,
          filename: result.public_id,
          path: result.secure_url,
          size: result.bytes,
        });
      } catch (err) {
        cb(ApiError.badRequest("Image processing failed."));
      }
    });
  },
  _removeFile(req, file, cb) {
    cb(null);
  },
});

const createUploader = (subfolder = "", preset = "standard") => {
  return multer({
    storage: createOptimizedStorage(subfolder, preset),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
};

const heroUpload = createUploader("hero");
const vehicleUpload = createUploader("vehicles");
const occasionUpload = createUploader("occasions");
const testimonialUpload = createUploader("testimonials", "avatar");
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
