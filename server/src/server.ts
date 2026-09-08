import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import investmentRoutes from './routes/investment';
import reportRoutes from './routes/report';
import websiteCheckRoutes from './routes/websiteCheck';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit authentication attempts (login/register) to 15 per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again after 15 minutes.' },
});

const websiteCheckLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit website check scans per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Website check limit reached. Please try again later.' },
});

app.use(globalLimiter);

// CORS Configuration
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, postman, curl)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS security policy'));
    }
  },
  credentials: true,
}));

// Body Parsers & Data Sanitization against NoSQL Query Injection
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(mongoSanitize());

app.use(morgan('dev'));

// Database Connection
connectDB();

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/website-check', websiteCheckLimiter, websiteCheckRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Server is running safely' });
});

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Central Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
