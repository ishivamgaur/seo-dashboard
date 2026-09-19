import Schema from '../models/Schema.js';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getAll = catchAsync(async (req, res) => {
  const whereClause = req.query.all === 'true' ? {} : { is_active: true };
  const schemas = await Schema.findAll({
    where: whereClause,
    order: [['created_at', 'ASC']],
  });
  res.status(200).json(new ApiResponse(200, 'Schemas retrieved successfully', schemas));
});

export const getOne = catchAsync(async (req, res) => {
  const schema = await Schema.findByPk(req.params.id);
  if (!schema) {
    throw new ApiError(404, 'Schema not found');
  }
  res.status(200).json(new ApiResponse(200, 'Schema retrieved successfully', schema));
});

export const create = catchAsync(async (req, res) => {
  const schema = await Schema.create(req.body);
  res.status(201).json(new ApiResponse(201, 'Schema created successfully', schema));
});

export const update = catchAsync(async (req, res) => {
  const schema = await Schema.findByPk(req.params.id);
  if (!schema) {
    throw new ApiError(404, 'Schema not found');
  }
  const updatedSchema = await schema.update(req.body);
  res.status(200).json(new ApiResponse(200, 'Schema updated successfully', updatedSchema));
});

export const remove = catchAsync(async (req, res) => {
  const schema = await Schema.findByPk(req.params.id);
  if (!schema) {
    throw new ApiError(404, 'Schema not found');
  }
  await schema.destroy();
  res.status(200).json(new ApiResponse(200, 'Schema deleted successfully', null));
});

export const toggleActive = catchAsync(async (req, res) => {
  const schema = await Schema.findByPk(req.params.id);
  if (!schema) {
    throw new ApiError(404, 'Schema not found');
  }
  schema.is_active = !schema.is_active;
  await schema.save();
  res.status(200).json(new ApiResponse(200, 'Schema status toggled successfully', schema));
});
