import Joi from 'joi';
import { AppError } from '../middleware/errorHandler';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().trim().min(2).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const investmentSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  amount: Joi.number().positive().required(),
  expectedReturn: Joi.number().min(0).optional(),
  riskLevel: Joi.string().valid('low', 'medium', 'high').optional(),
  investorName: Joi.string().allow('', null).optional(),
  websiteUrl: Joi.string().uri().allow('', null).optional(),
  type: Joi.string().allow('', null).optional(),
  duration: Joi.string().allow('', null).optional(),
  documents: Joi.array().items(Joi.string()).optional(),
});

export const reportCreateSchema = Joi.object({
  investmentId: Joi.string().required(),
  location: Joi.string().allow('', null).optional(),
  comments: Joi.string().allow('', null).optional(),
});

export const updateReportStatusSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Under Review', 'Verified Scam', 'Dismissed').required(),
  note: Joi.string().allow('', null).optional(),
});

export const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid('user', 'admin').required(),
});

export const websiteCheckSchema = Joi.object({
  url: Joi.string().uri().required(),
});

export const validate = (schema: Joi.ObjectSchema, data: any) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.map(d => d.message);
    throw new AppError('Validation failed', 400, details);
  }
  return value;
};
