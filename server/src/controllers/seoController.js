import SeoSetting from '../models/SeoSetting.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getSeo = catchAsync(async (req, res) => {
  const seo = await SeoSetting.findOne();
  res.status(200).json(new ApiResponse(200, seo || {}, 'SEO settings retrieved successfully'));
});

export const updateSeo = catchAsync(async (req, res) => {
  let seo = await SeoSetting.findOne();
  
  if (seo) {
    seo = await seo.update(req.body);
  } else {
    seo = await SeoSetting.create(req.body);
  }
  
  res.status(200).json(new ApiResponse(200, seo, 'SEO settings updated successfully'));
});
