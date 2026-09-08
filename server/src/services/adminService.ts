import User from '../models/User';
import Investment from '../models/Investment';
import Report, { ReportStatusType } from '../models/Report';
import { AppError } from '../middleware/errorHandler';

export const getAdminStats = async () => {
  const [
    totalUsers,
    totalInvestments,
    totalReports,
    pendingReports,
    highRiskReports,
    recentReports,
    recentUsers,
    allReports,
  ] = await Promise.all([
    User.countDocuments(),
    Investment.countDocuments(),
    Report.countDocuments(),
    Report.countDocuments({ status: 'Pending' }),
    Report.countDocuments({ riskScore: { $gte: 60 } }),
    Report.find().populate('investmentId').populate('userId', 'fullName email role').sort({ createdAt: -1 }).limit(8),
    User.find().select('-password').sort({ createdAt: -1 }).limit(8),
    Report.find().select('riskScore status fraudIndicators generatedAt'),
  ]);

  // Risk breakdown
  let safeCount = 0;
  let suspiciousCount = 0;
  let highRiskCount = 0;

  // Status breakdown
  const statusCounts: Record<string, number> = {
    Pending: 0,
    'Under Review': 0,
    Verified: 0,
    Rejected: 0,
    Closed: 0,
  };

  // Fraud indicators frequency
  const indicatorCounts: Record<string, number> = {};

  allReports.forEach((r) => {
    if (r.riskScore >= 60) highRiskCount++;
    else if (r.riskScore >= 30) suspiciousCount++;
    else safeCount++;

    const st = r.status || 'Pending';
    statusCounts[st] = (statusCounts[st] || 0) + 1;

    if (r.fraudIndicators && Array.isArray(r.fraudIndicators)) {
      r.fraudIndicators.forEach((ind) => {
        indicatorCounts[ind] = (indicatorCounts[ind] || 0) + 1;
      });
    }
  });

  const topIndicators = Object.entries(indicatorCounts)
    .map(([indicator, count]) => ({ indicator, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    overview: {
      totalUsers,
      totalInvestments,
      totalReports,
      highRiskCases: highRiskReports,
      pendingReports,
    },
    analytics: {
      riskDistribution: {
        safe: safeCount,
        suspicious: suspiciousCount,
        highRisk: highRiskCount,
      },
      statusDistribution: statusCounts,
      topIndicators,
    },
    recentReports,
    recentUsers,
  };
};

export const getAllReports = async (query: { status?: string; search?: string }) => {
  const filter: any = {};
  if (query.status && query.status !== 'all') {
    filter.status = query.status;
  }

  const reports = await Report.find(filter)
    .populate('investmentId')
    .populate('userId', 'fullName email role')
    .sort({ createdAt: -1 });

  if (query.search) {
    const s = query.search.toLowerCase();
    return reports.filter((r: any) => {
      const invName = r.investmentId?.name?.toLowerCase() || '';
      const repId = r.reportId?.toLowerCase() || '';
      const userEmail = r.userId?.email?.toLowerCase() || '';
      const location = r.reporterLocation?.toLowerCase() || '';
      return invName.includes(s) || repId.includes(s) || userEmail.includes(s) || location.includes(s);
    });
  }

  return reports;
};

export const getAllUsers = async () => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  const userStats = await Promise.all(
    users.map(async (u) => {
      const [investmentsCount, reportsCount] = await Promise.all([
        Investment.countDocuments({ userId: u._id }),
        Report.countDocuments({ userId: u._id }),
      ]);
      return {
        ...u.toObject(),
        investmentsCount,
        reportsCount,
      };
    })
  );
  return userStats;
};

export const updateUserRole = async (targetUserId: string, role: 'user' | 'admin') => {
  const user = await User.findById(targetUserId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  user.role = role;
  await user.save();
  return { id: user._id, email: user.email, fullName: user.fullName, role: user.role, isBlocked: user.isBlocked };
};

export const toggleUserBlock = async (targetUserId: string) => {
  const user = await User.findById(targetUserId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  user.isBlocked = !user.isBlocked;
  await user.save();
  return { id: user._id, email: user.email, fullName: user.fullName, role: user.role, isBlocked: user.isBlocked };
};

export const updateReportStatusByAdmin = async (
  reportId: string,
  status: ReportStatusType,
  note?: string
) => {
  const report = await Report.findById(reportId).populate('investmentId').populate('userId', 'fullName email');
  if (!report) {
    throw new AppError('Report not found', 404);
  }
  report.status = status;
  report.statusHistory.push({
    status,
    timestamp: new Date(),
    note: note || `Status officially set to ${status} by Admin`,
  });
  await report.save();
  return report;
};
