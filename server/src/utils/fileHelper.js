import fs from 'fs';
import path from 'path';

const getUploadPath = (subfolder = '') => {
  return path.join(process.cwd(), 'uploads', subfolder);
};

const deleteFile = (filePath) => {
  if (!filePath) return;

  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath.replace(/^\/+/, ''));

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch {
    // Suppress filesystem errors during media cleanup to avoid breaking main workflow
  }
};

const getFileUrl = (filename, subfolder = '') => {
  if (!filename) return null;
  return subfolder ? `/uploads/${subfolder}/${filename}` : `/uploads/${filename}`;
};

export { getUploadPath, deleteFile, getFileUrl };
export default {
  getUploadPath,
  deleteFile,
  getFileUrl
};
