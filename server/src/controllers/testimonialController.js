import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { createCrudController } from '../utils/crudFactory.js';
import { deleteFile } from '../utils/fileHelper.js';
import Testimonial from '../models/Testimonial.js';

const crud = createCrudController(Testimonial, 'Testimonial');

export const getAll = crud.getAll;

export const create = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.customerImage = req.file.path;
  }
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json(new ApiResponse(201, 'Testimonial created successfully', testimonial));
});

export const update = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.findByPk(req.params.id);
  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  if (req.file) {
    if (testimonial.customerImage) {
      deleteFile(testimonial.customerImage);
    }
    req.body.customerImage = req.file.path;
  }

  await testimonial.update(req.body);
  res.status(200).json(new ApiResponse(200, 'Testimonial updated successfully', testimonial));
});

export const remove = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.findByPk(req.params.id);
  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  if (testimonial.customerImage) {
    deleteFile(testimonial.customerImage);
  }

  await testimonial.destroy();
  res.status(200).json(new ApiResponse(200, 'Testimonial deleted successfully', null));
});
