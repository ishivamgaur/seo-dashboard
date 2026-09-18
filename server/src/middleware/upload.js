import fs from 'fs';
import path from 'path';

import multer from 'multer';

import { ApiError } from '../utils/ApiError.js';
import { getUploadPath } from '../utils/fileHelper.js';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
  const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest('Invalid file type. Only JPG, JPEG, PNG, GIF, and WEBP images are allowed.'));
  }
};

const createStorage = (subfolder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = getUploadPath(subfolder);
      // Ensure target directory exists before Multer attempts to write to disk
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}${ext}`);
    },
  });
};

const createUploader = (subfolder = '') => {
  return multer({
    storage: createStorage(subfolder),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
};

const heroUpload = createUploader('hero');
const vehicleUpload = createUploader('vehicles');
const occasionUpload = createUploader('occasions');
const testimonialUpload = createUploader('testimonials');
const galleryUpload = createUploader('gallery');
const generalUpload = createUploader('general');

export {
  createUploader,
  heroUpload,
  vehicleUpload,
  occasionUpload,
  testimonialUpload,
  galleryUpload,
  generalUpload,
};
export default createUploader;
