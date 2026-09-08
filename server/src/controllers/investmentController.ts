import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as investmentService from '../services/investmentService';
import { validate, investmentSchema } from '../validators/schemas';

export const createInvestment = async (req: AuthRequest, res: Response) => {
  const validated = validate(investmentSchema, req.body);
  const investment = await investmentService.createInvestment(req.userId!, validated);

  res.status(201).json({
    success: true,
    message: 'Investment created and analyzed',
    data: investment,
  });
};

export const getInvestment = async (req: AuthRequest, res: Response) => {
  const investment = await investmentService.getInvestmentById(req.params.id, req.userId, req.user?.role);
  
  res.status(200).json({
    success: true,
    data: investment,
  });
};

export const getUserInvestments = async (req: AuthRequest, res: Response) => {
  const investments = await investmentService.getUserInvestments(req.userId!);

  res.status(200).json({
    success: true,
    data: investments,
  });
};

export const updateInvestment = async (req: AuthRequest, res: Response) => {
  const validated = validate(investmentSchema, req.body);
  const investment = await investmentService.updateInvestment(
    req.params.id,
    req.userId!,
    validated
  );

  res.status(200).json({
    success: true,
    message: 'Investment updated',
    data: investment,
  });
};

export const deleteInvestment = async (req: AuthRequest, res: Response) => {
  await investmentService.deleteInvestment(req.params.id, req.userId!);

  res.status(200).json({
    success: true,
    message: 'Investment deleted',
  });
};
