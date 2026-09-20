import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import AboutSection from "../models/AboutSection.js";
import { deleteFile } from "../utils/fileHelper.js";

export const getAbout = catchAsync(async (req, res) => {
  const about = await AboutSection.findOne();
  return res.json(new ApiResponse(200, "About section fetched successfully", about));
});

export const updateAbout = catchAsync(async (req, res) => {
  let about = await AboutSection.findOne();
  const updateData = { ...req.body };

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

  return res.json(new ApiResponse(200, "About section updated successfully", about));
});
