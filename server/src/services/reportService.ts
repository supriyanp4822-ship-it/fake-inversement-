import Report, { ReportStatusType } from '../models/Report';
import Investment from '../models/Investment';
import { AppError } from '../middleware/errorHandler';
import mongoose from 'mongoose';

const escapeRegex = (text: string): string => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

const generateUniqueReportId = (): string => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();
  return `FID-${year}-${randomSuffix}`;
};

export const generateReport = async (userId: string, investmentId: string, location?: string, comments?: string) => {
  const investment = await Investment.findById(investmentId);
  if (!investment) {
    throw new AppError('Investment not found', 404);
  }

  if (investment.userId.toString() !== userId) {
    throw new AppError('Access denied: Unauthorized investment report generation', 403);
  }

  const fraudIndicators: string[] = [];
  if (investment.expectedReturn > 50) {
    fraudIndicators.push('Unusually high expected returns');
  }
  if (!investment.documents || investment.documents.length === 0) {
    fraudIndicators.push('Insufficient documentation');
  }
  if (!investment.investorName) {
    fraudIndicators.push('Missing investor details');
  }

  const reportId = generateUniqueReportId();

  const report = new Report({
    reportId,
    userId,
    investmentId,
    riskScore: investment.fraudScore,
    fraudIndicators,
    recommendations: [
      'Verify all documents thoroughly',
      'Check investor credentials',
      'Conduct background research',
    ],
    summary: `Investment "${investment.name}" scored ${investment.fraudScore}/100 risk points.`,
    reporterLocation: location,
    additionalComments: comments,
    status: 'Pending',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: new Date(),
        note: 'Report generated and submitted by user for review.',
      },
    ],
  });

  await report.save();
  return report.populate('investmentId');
};

export const getUserReports = async (userId: string) => {
  return Report.find({ userId }).populate('investmentId').sort({ generatedAt: -1 });
};

export const getReportById = async (reportId: string, userId?: string, userRole?: string) => {
  let report;
  if (mongoose.Types.ObjectId.isValid(reportId)) {
    report = await Report.findById(reportId).populate('investmentId');
  }
  if (!report) {
    const safeRegex = new RegExp(`^${escapeRegex(reportId)}$`, 'i');
    report = await Report.findOne({ reportId: safeRegex }).populate('investmentId');
  }
  if (!report) {
    throw new AppError('Report not found', 404);
  }

  // IDOR check: Only the report creator or an admin can access report details
  if (userRole !== 'admin' && userId && report.userId.toString() !== userId) {
    throw new AppError('Access denied: You do not have permission to view this report', 403);
  }

  return report;
};

export const trackReport = async (trackingId: string) => {
  const cleanId = trackingId.trim();
  let report = null;

  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    report = await Report.findById(cleanId).populate('investmentId');
  }
  
  if (!report) {
    const safeRegex = new RegExp(`^${escapeRegex(cleanId)}$`, 'i');
    report = await Report.findOne({
      $or: [
        { reportId: safeRegex },
        { reportId: cleanId },
      ],
    }).populate('investmentId');
  }

  if (!report) {
    throw new AppError(`No report found with ID: ${cleanId}`, 404);
  }

  return report;
};

export const updateReportStatus = async (
  reportId: string,
  status: ReportStatusType,
  note?: string
) => {
  const report = await getReportById(reportId);
  report.status = status;
  report.statusHistory.push({
    status,
    timestamp: new Date(),
    note: note || `Status updated to ${status}`,
  });
  await report.save();
  return report;
};
