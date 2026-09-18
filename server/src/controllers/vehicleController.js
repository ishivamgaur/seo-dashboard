import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { createCrudController } from '../utils/crudFactory.js';
import { deleteFile } from '../utils/fileHelper.js';
import Vehicle from '../models/Vehicle.js';

const crud = createCrudController(Vehicle, 'Vehicle');

export const getAll = crud.getAll;
export const getOne = crud.getOne;

export const create = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = `/uploads/vehicles/${req.file.filename}`;
  }
  const vehicle = await Vehicle.create(req.body);
  res.status(201).json(new ApiResponse(201, 'Vehicle created successfully', vehicle));
});

export const update = catchAsync(async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  if (req.file) {
    if (vehicle.image) {
      deleteFile(vehicle.image);
    }
    req.body.image = `/uploads/vehicles/${req.file.filename}`;
  }

  await vehicle.update(req.body);
  res.status(200).json(new ApiResponse(200, 'Vehicle updated successfully', vehicle));
});

export const remove = catchAsync(async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  if (vehicle.image) {
    deleteFile(vehicle.image);
  }
  
  await vehicle.destroy();
  res.status(200).json(new ApiResponse(200, 'Vehicle deleted successfully', null));
});

export const reorder = catchAsync(async (req, res) => {
  const { order } = req.body;
  if (Array.isArray(order)) {
    for (const item of order) {
      await Vehicle.update({ sortOrder: item.sortOrder }, { where: { id: item.id } });
    }
  }
  res.status(200).json(new ApiResponse(200, 'Vehicles reordered successfully', null));
});
