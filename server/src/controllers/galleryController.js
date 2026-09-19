import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { deleteFile } from '../utils/fileHelper.js';
import GalleryImage from '../models/GalleryImage.js';

export const getAll = catchAsync(async (req, res) => {
  const images = await GalleryImage.findAll({ order: [['sort_order', 'ASC']] });
  res.status(200).json(new ApiResponse(200, 'Gallery images retrieved successfully', images));
});

export const upload = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'No images provided');
  }

  const imageData = req.files.map(file => ({
    imagePath: file.path,
    altTag: req.body.altTag || ''
  }));

  const createdImages = await GalleryImage.bulkCreate(imageData);
  res.status(201).json(new ApiResponse(201, 'Images uploaded successfully', createdImages));
});

export const update = catchAsync(async (req, res) => {
  const image = await GalleryImage.findByPk(req.params.id);
  if (!image) {
    throw new ApiError(404, 'Image not found');
  }

  const updates = {};
  if (req.body.altTag !== undefined) {
    updates.altTag = req.body.altTag;
  }

  if (req.file) {
    if (image.imagePath) {
      deleteFile(image.imagePath);
    }
    updates.imagePath = req.file.path;
  }

  await image.update(updates);
  res.status(200).json(new ApiResponse(200, 'Gallery image updated successfully', image));
});

export const updateAlt = update;

export const remove = catchAsync(async (req, res) => {
  const image = await GalleryImage.findByPk(req.params.id);
  if (!image) {
    throw new ApiError(404, 'Image not found');
  }

  if (image.imagePath) {
    deleteFile(image.imagePath);
  }

  await image.destroy();
  res.status(200).json(new ApiResponse(200, 'Image deleted successfully', null));
});

export const reorder = catchAsync(async (req, res) => {
  const { order } = req.body;
  if (Array.isArray(order)) {
    for (const item of order) {
      await GalleryImage.update({ sortOrder: item.sortOrder }, { where: { id: item.id } });
    }
  }
  res.status(200).json(new ApiResponse(200, 'Images reordered successfully', null));
});
