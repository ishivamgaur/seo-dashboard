import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/environment.js';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    // Extract public ID from Cloudinary URL
    // URL looks like: https://res.cloudinary.com/cloud_name/image/upload/v123456789/seo-dashboard/vehicles/filename.jpg
    const parts = fileUrl.split('/');
    const filenameWithExt = parts.pop();
    const subfolder = parts.pop();
    const rootFolder = parts.pop();

    if (rootFolder === 'seo-dashboard') {
      const publicId = `${rootFolder}/${subfolder}/${filenameWithExt.split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted image from Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error(`Failed to delete Cloudinary file: ${fileUrl}`, error);
  }
};
