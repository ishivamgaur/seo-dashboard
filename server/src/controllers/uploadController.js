import multer from "multer";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  optimizeBuffer,
  uploadBuffer,
  PRESETS,
  fileFilterFor,
} from "../middleware/upload.js";

const memory = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilterFor(),
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("image");

// Standalone upload step: optimizes the file immediately and returns
// its URL, so the admin sees upload errors before touching save.
export const uploadImage = [
  (req, res, next) =>
    memory(req, res, (err) => {
      if (err) return next(err);
      next();
    }),
  catchAsync(async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest("No image file received.");
    }
    const preset = PRESETS[req.query.preset] || PRESETS.standard;
    const folder = (req.query.folder || "general").replace(/[^a-z-]/g, "") || "general";
    const { buffer, format } = await optimizeBuffer(
      req.file.buffer,
      req.file.mimetype,
      preset
    );
    const result = await uploadBuffer(buffer, folder, format);
    return res.json(new ApiResponse(200, "Image uploaded successfully", { url: result.secure_url }));
  }),
];
