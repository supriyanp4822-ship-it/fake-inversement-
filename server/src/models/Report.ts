import mongoose, { Schema, Document } from 'mongoose';

export type ReportStatusType = 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Closed';
export type RiskLevelType = 'Low Risk' | 'Medium Risk' | 'High Risk';

export interface IStatusHistory {
  status: ReportStatusType;
  timestamp: Date;
  note?: string;
}

export interface IReport extends Document {
  reportId: string;
  userId: mongoose.Types.ObjectId;
  investmentId: mongoose.Types.ObjectId;
  riskScore: number;
  riskLevel: RiskLevelType;
  riskReasons: string[];
  fraudIndicators: string[];
  recommendations: string[];
  summary: string;
  reporterLocation?: string;
  additionalComments?: string;
  status: ReportStatusType;
  statusHistory: IStatusHistory[];
  generatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reportId: { type: String, unique: true, sparse: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    investmentId: { type: Schema.Types.ObjectId, ref: 'Investment', required: true },
    riskScore: { type: Number, min: 0, max: 100 },
    riskLevel: { type: String, enum: ['Low Risk', 'Medium Risk', 'High Risk'], default: 'Medium Risk' },
    riskReasons: { type: [String], default: [] },
    fraudIndicators: [String],
    recommendations: [String],
    summary: String,
    reporterLocation: String,
    additionalComments: String,
    status: { type: String, enum: ['Pending', 'Under Review', 'Verified', 'Rejected', 'Closed'], default: 'Pending' },
    statusHistory: [
      {
        status: { type: String, enum: ['Pending', 'Under Review', 'Verified', 'Rejected', 'Closed'] },
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>('Report', ReportSchema);
