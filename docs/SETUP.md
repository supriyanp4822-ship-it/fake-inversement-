# Setup and Installation Guide

## Prerequisites
- Node.js v16+ installed
- npm or yarn package manager
- MongoDB (local or cloud instance like MongoDB Atlas)
- Git

## Installation Steps

### 1. Clone Repository
```bash
git clone <repository-url>
cd fake-investment-detection
```

### 2. Backend Setup

```bash
cd server
npm install
```

Copy environment variables:
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fake-investment-detection
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Copy environment variables:
```bash
cp .env.example .env
```

The default `VITE_API_URL=http://localhost:5000/api` should work for local development.

### 4. MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

**MongoDB Atlas (Cloud):**
1. Create account at mongodb.com
2. Create a cluster
3. Get connection string
4. Add to `.env`: `MONGODB_URI=<your-connection-string>`

### 5. Start Development Servers

**Option A: Concurrent (from project root)**
```bash
npm run dev
```

**Option B: Separate terminals**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Application will be available at `http://localhost:5173`

## Building for Production

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
npm run preview
```

## Troubleshooting

### Port Already in Use
```bash
# Windows - Find and kill process using port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network access if using MongoDB Atlas

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

### Server (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fake-investment-detection
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
UPLOAD_PATH=./uploads
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Scripts

### Server Scripts
- `npm run dev` - Start dev server with auto-reload
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Client Scripts
- `npm run dev` - Start dev server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Root Scripts
- `npm run dev` - Start both servers concurrently
- `npm run build` - Build both frontend and backend
- `npm run build:server` - Build only backend
- `npm run build:client` - Build only frontend
