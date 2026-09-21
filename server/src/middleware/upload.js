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
  social: {
    width: 1200,
    height: 630,
    fit: "cover",
    quality: 82,
    withoutEnlargement: false,
    formats: ["jpg", "jpeg", "png", "webp"],
  },
  standard: { width: 1600, height: 1600, fit: "inside", quality: 82 },
};

const DEFAULT_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];
const EXT_TO_MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

const fileFilterFor = (formats) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  const allowed = formats || DEFAULT_EXTENSIONS;
  const isValidExt = allowed.includes(ext);
  const isValidMime = file.mimetype === EXT_TO_MIME[ext] && allowed.includes(ext);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest(`Invalid file type. Allowed: ${allowed.join(", ").toUpperCase()}.`));
  }
};

const optimizeBuffer = async (buffer, mimetype, preset) => {
  const image = sharp(buffer).rotate();
  if (mimetype === "image/gif") {
    return { buffer: await image.toBuffer(), format: "gif" };
  }
  const optimized = await image
    .resize({
      width: preset.width,
      height: preset.height,
      fit: preset.fit,
      withoutEnlargement: preset.withoutEnlargement ?? true,
    })
    .webp({ quality: preset.quality })
    .toBuffer();
  return { buffer: optimized, format: "webp" };
};

const uploadBuffer = (buffer, subfolder, format) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `seo-dashboard/${subfolder}`,
        resource_type: "image",
        format,
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
        const { buffer, format } = await optimizeBuffer(
          Buffer.concat(chunks),
          file.mimetype,
          preset
        );
        const result = await uploadBuffer(buffer, subfolder, format);
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
  const presetDef = PRESETS[preset] || PRESETS.standard;
  return multer({
    storage: createOptimizedStorage(subfolder, preset),
    fileFilter: fileFilterFor(presetDef.formats),
    limits: {
      fileSize: 10 * 1024 * 1024,
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
  optimizeBuffer,
  uploadBuffer,
  fileFilterFor,
  PRESETS,
};
export default createUploader;
