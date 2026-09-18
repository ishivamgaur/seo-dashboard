import Schema from '../models/Schema.js';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getAll = catchAsync(async (req, res) => {
  const schemas = await Schema.findAll({
    where: { is_active: true },
    order: [['created_at', 'DESC']]
  });
  res.status(200).json(new ApiResponse(200, schemas, 'Schemas retrieved successfully'));
});

export const getOne = catchAsync(async (req, res) => {
  const schema = await Schema.findByPk(req.params.id);
  if (!schema) {
    throw new ApiError(404, 'Schema not found');
  }
  res.status(200).json(new ApiResponse(200, schema, 'Schema retrieved successfully'));
});

export const create = catchAsync(async (req, res) => {
  const schema = await Schema.create(req.body);
  res.status(201).json(new ApiResponse(201, schema, 'Schema created successfully'));
});

export const update = catchAsync(async (req, res) => {
  const schema = await Schema.findByPk(req.params.id);
  if (!schema) {
    throw new ApiError(404, 'Schema not found');
  }
  const updatedSchema = await schema.update(req.body);
  res.status(200).json(new ApiResponse(200, updatedSchema, 'Schema updated successfully'));
});

export const remove = catchAsync(async (req, res) => {
  const schema = await Schema.findByPk(req.params.id);
  if (!schema) {
    throw new ApiError(404, 'Schema not found');
  }
  await schema.destroy();
  res.status(200).json(new ApiResponse(200, null, 'Schema deleted successfully'));
});

export const toggleActive = catchAsync(async (req, res) => {
  const schema = await Schema.findByPk(req.params.id);
  if (!schema) {
    throw new ApiError(404, 'Schema not found');
  }
  schema.is_active = !schema.is_active;
  await schema.save();
  res.status(200).json(new ApiResponse(200, schema, 'Schema status toggled successfully'));
});
