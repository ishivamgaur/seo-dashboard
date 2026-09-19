import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import AboutSection from '../models/AboutSection.js';
import { deleteFile } from '../utils/fileHelper.js';

const parseHighlights = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return undefined;
};

const parseIntOrUndefined = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? undefined : n;
};

export const getAbout = catchAsync(async (req, res) => {
  const about = await AboutSection.findOne();
  return res.json(new ApiResponse(200, 'About section fetched successfully', about));
});

export const updateAbout = catchAsync(async (req, res) => {
  let about = await AboutSection.findOne();
  const updateData = { ...req.body };

  const highlights = parseHighlights(req.body.highlights);
  if (highlights !== undefined) updateData.highlights = highlights;

  for (const key of ['yearsExperience', 'citiesCovered', 'fleetSize', 'tripsCompleted']) {
    const parsed = parseIntOrUndefined(req.body[key]);
    if (parsed !== undefined) {
      updateData[key] = parsed;
    } else if (req.body[key] === '') {
      updateData[key] = null;
    }
  }

  if (req.file) {
    updateData.featuredImage = req.file.path;
    if (about && about.featuredImage) {
      await deleteFile(about.featuredImage);
    }
  }

  if (about) {
    Object.assign(about, updateData);
    await about.save();
  } else {
    about = await AboutSection.create(updateData);
  }

  return res.json(new ApiResponse(200, 'About section updated successfully', about));
});
