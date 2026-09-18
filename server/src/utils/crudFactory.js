import { catchAsync } from './catchAsync.js';
import { ApiError } from './ApiError.js';
import { ApiResponse } from './ApiResponse.js';

const getOrderClause = (Model) => {
  const order = [];
  const attrs = Model.rawAttributes || {};

  // Respect sort_order when present on the model
  if ('sort_order' in attrs || 'sortOrder' in attrs) {
    const col = 'sort_order' in attrs ? 'sort_order' : 'sortOrder';
    order.push([col, 'ASC']);
  }

  if ('created_at' in attrs || 'createdAt' in attrs) {
    const col = 'created_at' in attrs ? 'created_at' : 'createdAt';
    order.push([col, 'DESC']);
  }

  return order.length ? order : undefined;
};

const createCrudController = (Model, resourceName = 'Resource') => ({
  getAll: catchAsync(async (req, res) => {
    const order = getOrderClause(Model);
    const records = await Model.findAll({ order });

    new ApiResponse(200, `${resourceName} records fetched successfully`, records).send(res);
  }),

  getOne: catchAsync(async (req, res) => {
    const record = await Model.findByPk(req.params.id);

    if (!record) {
      throw ApiError.notFound(`${resourceName} not found`);
    }

    new ApiResponse(200, `${resourceName} fetched successfully`, record).send(res);
  }),

  create: catchAsync(async (req, res) => {
    const record = await Model.create(req.body);

    new ApiResponse(201, `${resourceName} created successfully`, record).send(res);
  }),

  update: catchAsync(async (req, res) => {
    const record = await Model.findByPk(req.params.id);

    if (!record) {
      throw ApiError.notFound(`${resourceName} not found`);
    }

    await record.update(req.body);

    new ApiResponse(200, `${resourceName} updated successfully`, record).send(res);
  }),

  remove: catchAsync(async (req, res) => {
    const record = await Model.findByPk(req.params.id);

    if (!record) {
      throw ApiError.notFound(`${resourceName} not found`);
    }

    await record.destroy();

    new ApiResponse(200, `${resourceName} deleted successfully`).send(res);
  })
});

export { createCrudController };
export default createCrudController;
