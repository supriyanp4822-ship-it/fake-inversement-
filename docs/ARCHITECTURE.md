# Architecture Documentation

## System Overview

The Fake Investment Detection application is a full-stack system designed to analyze investment opportunities and detect fraudulent schemes.

## Components

### Frontend (React + TypeScript)
- **Authentication**: Login/Register with JWT token storage
- **Investment Analysis**: Form to submit investment details for analysis
- **Real-time Fraud Detection**: Automatic risk scoring of investments
- **Report Generation**: Detailed analysis reports with fraud indicators
- **Dashboard**: Overview of investments and risk statistics

### Backend (Express + MongoDB)
- **Authentication Service**: User registration and login with JWT tokens
- **Investment Analysis**: Fraud detection algorithm with scoring
- **Report Generation**: Comprehensive analysis reports
- **Database**: MongoDB for data persistence

## Data Flow

1. User registers/logs in → JWT token issued
2. User submits investment data → API receives request
3. Fraud detection algorithm analyzes data
4. Score and status calculated and stored
5. Report generated with findings
6. Data displayed in frontend

## Fraud Detection Algorithm

Factors considered:
- Expected return percentage (high returns = higher risk)
- Description quality and length
- Investor information completeness
- Supporting documentation
- Risk level vs expected returns ratio

Score ranges:
- 0-39: Safe
- 40-69: Flagged
- 70-100: High Risk

## API Structure

All endpoints require Bearer token authentication (except auth endpoints)

Base URL: `/api`

### Auth Routes
- POST `/auth/register` - User registration
- POST `/auth/login` - User login
- POST `/auth/logout` - User logout

### Investment Routes
- GET `/investments` - List user's investments
- POST `/investments` - Create investment analysis
- GET `/investments/:id` - Get investment details
- PUT `/investments/:id` - Update investment
- DELETE `/investments/:id` - Delete investment

### Report Routes
- GET `/reports` - List user's reports
- POST `/reports` - Generate new report
- GET `/reports/:id` - Get report details

## Security Features
- JWT token-based authentication
- Password hashing with bcryptjs
- CORS protection
- Helmet.js for security headers
- Input validation with Joi
