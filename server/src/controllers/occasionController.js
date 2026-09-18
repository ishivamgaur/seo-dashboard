import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { createCrudController } from '../utils/crudFactory.js';
import { deleteFile } from '../utils/fileHelper.js';
import Occasion from '../models/Occasion.js';

const crud = createCrudController(Occasion, 'Occasion');

export const getAll = crud.getAll;

export const create = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = `/uploads/occasions/${req.file.filename}`;
  }
  const occasion = await Occasion.create(req.body);
  res.status(201).json(new ApiResponse(201, occasion, 'Occasion created successfully'));
});

export const update = catchAsync(async (req, res) => {
  const occasion = await Occasion.findByPk(req.params.id);
  if (!occasion) {
    throw new ApiError(404, 'Occasion not found');
  }

  if (req.file) {
    if (occasion.image) {
      deleteFile(occasion.image);
    }
    req.body.image = `/uploads/occasions/${req.file.filename}`;
  }

  await occasion.update(req.body);
  res.status(200).json(new ApiResponse(200, occasion, 'Occasion updated successfully'));
});

export const remove = catchAsync(async (req, res) => {
  const occasion = await Occasion.findByPk(req.params.id);
  if (!occasion) {
    throw new ApiError(404, 'Occasion not found');
  }

  if (occasion.image) {
    deleteFile(occasion.image);
  }
  
  await occasion.destroy();
  res.status(200).json(new ApiResponse(200, null, 'Occasion deleted successfully'));
});
