import SeoSetting from "../models/SeoSetting.js";
import catchAsync from "../utils/catchAsync.js";
import ApiResponse from "../utils/ApiResponse.js";
import { deleteFile } from "../utils/fileHelper.js";

const toBoolean = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return Boolean(value);
};

export const getSeo = catchAsync(async (req, res) => {
  const seo = await SeoSetting.findOne();
  res.status(200).json(new ApiResponse(200, "SEO settings retrieved successfully", seo || {}));
});

export const updateSeo = catchAsync(async (req, res) => {
  let seo = await SeoSetting.findOne();
  const updateData = { ...req.body };

  updateData.robotsIndex = toBoolean(req.body.robotsIndex, seo?.robotsIndex ?? true);
  updateData.robotsFollow = toBoolean(req.body.robotsFollow, seo?.robotsFollow ?? true);

  const ogFile = req.files?.ogImageFile?.[0];
  if (ogFile) {
    updateData.ogImage = ogFile.path;
    if (seo?.ogImage) await deleteFile(seo.ogImage);
  }

  const twitterFile = req.files?.twitterImageFile?.[0];
  if (twitterFile) {
    updateData.twitterImage = twitterFile.path;
    if (seo?.twitterImage) await deleteFile(seo.twitterImage);
  }

  if (seo) {
    seo = await seo.update(updateData);
  } else {
    seo = await SeoSetting.create(updateData);
  }

  res.status(200).json(new ApiResponse(200, "SEO settings updated successfully", seo));
});
