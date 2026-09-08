# Fake Investment Detection

A comprehensive full-stack application designed to detect and prevent fraudulent investment schemes through advanced analysis and detection algorithms.

## Features

- **Real-time Detection**: Analyze investment opportunities for fraud indicators
- **User Authentication**: Secure login and registration system
- **Investment Analysis**: Detailed examination of investment proposals
- **Risk Scoring**: Automated risk assessment and fraud probability calculation
- **Document Upload**: Support for document uploads for detailed analysis
- **Historical Reports**: Track and review past analyses
- **Admin Dashboard**: Manage users and view system statistics

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite for fast build and development
- Tailwind CSS for styling
- Axios for API communication
- Context API for state management

### Backend
- Express.js with TypeScript
- MongoDB for data persistence
- JWT for authentication
- Multer for file uploads
- Joi for validation

## Project Structure

```
fake-investment-detection/
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # Utility functions
│   │   └── styles/      # Global styles
│   └── package.json
│
├── server/              # Express backend
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── services/        # Business logic
│   ├── validators/      # Input validation
│   ├── config/          # Configuration
│   └── package.json
│
├── docs/                # Documentation
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd fake-investment-detection
```

2. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Configure your MongoDB connection in .env
npm run dev
```

3. **Setup Frontend**
```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fake-investment
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
UPLOAD_PATH=./uploads
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Investments
- `GET /api/investments` - Get all investments
- `POST /api/investments` - Create new investment analysis
- `GET /api/investments/:id` - Get investment details
- `DELETE /api/investments/:id` - Delete investment

### Reports
- `GET /api/reports` - Get user reports
- `GET /api/reports/:id` - Get specific report
- `POST /api/reports/generate` - Generate new report

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details

## Support

For support, please open an issue in the repository or contact the development team.
