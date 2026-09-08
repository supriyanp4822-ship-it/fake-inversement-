import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as reportService from '../services/reportService';
import { validate, reportCreateSchema, updateReportStatusSchema } from '../validators/schemas';

export const generateReport = async (req: AuthRequest, res: Response) => {
  const validated = validate(reportCreateSchema, req.body);
  const report = await reportService.generateReport(
    req.userId!,
    validated.investmentId,
    validated.location,
    validated.comments
  );

  res.status(201).json({
    success: true,
    message: 'Report generated successfully',
    data: report,
  });
};

export const getUserReports = async (req: AuthRequest, res: Response) => {
  const reports = await reportService.getUserReports(req.userId!);

  res.status(200).json({
    success: true,
    data: reports,
  });
};

export const getReport = async (req: AuthRequest, res: Response) => {
  const report = await reportService.getReportById(req.params.id, req.userId, req.user?.role);

  res.status(200).json({
    success: true,
    data: report,
  });
};

export const trackReport = async (req: AuthRequest, res: Response) => {
  const { trackingId } = req.params;
  const report = await reportService.trackReport(trackingId);

  res.status(200).json({
    success: true,
    data: report,
  });
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  const validated = validate(updateReportStatusSchema, req.body);
  const { id } = req.params;
  const updatedReport = await reportService.updateReportStatus(id, validated.status, validated.note);

  res.status(200).json({
    success: true,
    message: 'Report status updated successfully',
    data: updatedReport,
  });
};
