# Copilot Instructions for Fake Investment Detection Project

This document provides Copilot with specific instructions for this project.

## Project Overview
- Full-stack application for detecting fraudulent investment schemes
- Frontend: React 18 with TypeScript and Vite
- Backend: Express.js with MongoDB
- Architecture: RESTful API with JWT authentication

## Frontend Structure
- `/client/src/components/` - Reusable React components (UI, Forms, Lists)
- `/client/src/pages/` - Page-level components
- `/client/src/services/` - API communication
- `/client/src/context/` - Zustand store for state management
- `/client/src/hooks/` - Custom React hooks
- `/client/src/utils/` - Utility functions
- `/client/src/styles/` - Global styles with Tailwind CSS

## Backend Structure
- `/server/src/controllers/` - Request handlers
- `/server/src/models/` - MongoDB schemas
- `/server/src/routes/` - API route definitions
- `/server/src/services/` - Business logic
- `/server/src/middleware/` - Express middleware
- `/server/src/validators/` - Input validation schemas
- `/server/src/config/` - Configuration files

## Key Technologies
- React 18, TypeScript, Vite, Tailwind CSS, Zustand, Axios
- Express.js, MongoDB, Mongoose, JWT, Bcrypt
- ESLint for code linting

## Development Setup
1. Install dependencies: `npm install` in both `/client` and `/server`
2. Configure environment variables: Copy `.env.example` to `.env`
3. Start development: `npm run dev` from project root

## Important Notes
- Authentication uses JWT tokens stored in localStorage
- Fraud score calculated based on investment characteristics
- API endpoints require Authorization header with Bearer token
- File uploads supported via Multer in `/server/uploads/`
