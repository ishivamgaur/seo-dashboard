import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../models/User.js';
import { config } from '../config/environment.js';

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const userData = user.toJSON();
  delete userData.password;

  res.status(200).json(new ApiResponse(200, { token, user: userData }, 'Login successful'));
});

export const getMe = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const userData = user.toJSON();
  delete userData.password;

  res.status(200).json(new ApiResponse(200, userData, 'User retrieved successfully'));
});
