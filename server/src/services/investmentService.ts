import Investment from '../models/Investment';
import { analyzeInvestment, getStatus } from './fraudDetection';
import { AppError } from '../middleware/errorHandler';

export const createInvestment = async (userId: string, investmentData: any) => {
  const { score, reasons } = analyzeInvestment(investmentData);
  const status = getStatus(score);

  const investment = new Investment({
    ...investmentData,
    userId,
    fraudScore: score,
    detectionReasons: reasons,
    analyzedAt: new Date(),
    status,
  });

  await investment.save();
  return investment;
};

export const getInvestmentById = async (investmentId: string, userId?: string, userRole?: string) => {
  const investment = await Investment.findById(investmentId).populate('userId', 'fullName email');
  if (!investment) {
    throw new AppError('Investment not found', 404);
  }

  // IDOR check: Only owner or admin can view investment details
  if (userRole !== 'admin' && userId && investment.userId._id.toString() !== userId && investment.userId.toString() !== userId) {
    throw new AppError('Access denied: You do not have permission to view this investment', 403);
  }

  return investment;
};

export const getUserInvestments = async (userId: string) => {
  return Investment.find({ userId }).sort({ createdAt: -1 });
};

export const updateInvestment = async (investmentId: string, userId: string, updateData: any) => {
  const investment = await Investment.findById(investmentId);
  if (!investment) {
    throw new AppError('Investment not found', 404);
  }
  if (investment.userId.toString() !== userId) {
    throw new AppError('Access denied: You can only edit your own investments', 403);
  }

  const { score, reasons } = analyzeInvestment({ ...investment.toObject(), ...updateData });
  const status = getStatus(score);

  investment.set({
    ...updateData,
    fraudScore: score,
    detectionReasons: reasons,
    analyzedAt: new Date(),
    status,
  });
  await investment.save();
  return investment;
};

export const deleteInvestment = async (investmentId: string, userId: string) => {
  const investment = await Investment.findById(investmentId);
  if (!investment) {
    throw new AppError('Investment not found', 404);
  }
  if (investment.userId.toString() !== userId) {
    throw new AppError('Access denied: You can only delete your own investments', 403);
  }

  await Investment.findByIdAndDelete(investmentId);
};
