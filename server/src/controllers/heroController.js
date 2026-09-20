import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import HeroSection from "../models/HeroSection.js";
import { deleteFile } from "../utils/fileHelper.js";

export const getHero = catchAsync(async (req, res) => {
  const hero = await HeroSection.findOne();
  return res.json(new ApiResponse(200, "Hero section fetched successfully", hero));
});

export const updateHero = catchAsync(async (req, res) => {
  let hero = await HeroSection.findOne();
  const updateData = { ...req.body };

  if (req.file) {
    updateData.bannerImage = req.file.path;
    if (hero && hero.bannerImage) {
      await deleteFile(hero.bannerImage);
    }
  }

  if (hero) {
    Object.assign(hero, updateData);
    await hero.save();
  } else {
    hero = await HeroSection.create(updateData);
  }

  return res.json(new ApiResponse(200, "Hero section updated successfully", hero));
});
