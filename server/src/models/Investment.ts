import mongoose, { Schema, Document } from 'mongoose';

export interface IInvestment extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  amount: number;
  expectedReturn: number;
  fraudScore: number;
  detectionReasons: string[];
  analyzedAt?: Date;
  investorName?: string;
  websiteUrl?: string;
  type?: string;
  duration?: string;
  documents?: string[];
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'flagged' | 'safe' | 'high_risk';
  analysis?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    expectedReturn: {
      type: Number,
      default: 0,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    investorName: String,
    websiteUrl: String,
    type: { type: String, default: 'Crypto & Forex' },
    duration: { type: String, default: '1 Month' },
    documents: [String],
    fraudScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    detectionReasons: {
      type: [String],
      default: [],
    },
    analyzedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'flagged', 'safe', 'high_risk'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IInvestment>('Investment', InvestmentSchema);
