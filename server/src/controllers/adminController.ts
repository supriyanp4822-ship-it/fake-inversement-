import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as adminService from '../services/adminService';

export const getDashboardStats = async (_req: AuthRequest, res: Response) => {
  const stats = await adminService.getAdminStats();
  res.status(200).json({
    success: true,
    data: stats,
  });
};

export const getReports = async (req: AuthRequest, res: Response) => {
  const { status, search } = req.query;
  const reports = await adminService.getAllReports({
    status: status as string,
    search: search as string,
  });
  res.status(200).json({
    success: true,
    data: reports,
  });
};

export const getUsers = async (_req: AuthRequest, res: Response) => {
  const users = await adminService.getAllUsers();
  res.status(200).json({
    success: true,
    data: users,
  });
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const updatedUser = await adminService.updateUserRole(id, role);
  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    data: updatedUser,
  });
};

export const toggleUserBlock = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updatedUser = await adminService.toggleUserBlock(id);
  res.status(200).json({
    success: true,
    message: `User block status updated`,
    data: updatedUser,
  });
};

export const updateReportStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const updatedReport = await adminService.updateReportStatusByAdmin(id, status, note);
  res.status(200).json({
    success: true,
    message: `Report status updated to ${status}`,
    data: updatedReport,
  });
};
