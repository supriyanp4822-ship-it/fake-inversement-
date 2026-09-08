# Quick Start Guide

Get up and running with the Fake Investment Detection system in 5 minutes!

## 1. Prerequisites
- Node.js v16+ ([Download](https://nodejs.org))
- MongoDB ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git

## 2. Clone & Install

```bash
# Navigate to project directory
cd fake-investment-detection

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## 3. Configure Environment

```bash
# Server configuration
cd ../server
cp .env.example .env

# Client configuration
cd ../client
cp .env.example .env
```

Edit the `.env` files with your settings:

**Server `.env`:**
```
MONGODB_URI=mongodb://localhost:27017/fake-investment-detection
JWT_SECRET=your-secret-key
```

**Client `.env`:**
```
VITE_API_URL=http://localhost:5000/api
```

## 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas (Cloud):**
- Create account and cluster
- Update MONGODB_URI in server/.env

## 5. Run the Application

From the project root:
```bash
npm run dev
```

Or in separate terminals:
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

The application will be available at **http://localhost:5173**

## 6. Test the Application

1. **Register**: Click "Register" and create a new account
2. **Login**: Use your credentials to log in
3. **Analyze**: Go to "Investments" and submit an investment for analysis
4. **View Results**: Check the fraud score and analysis
5. **Reports**: View detailed reports in the "Reports" section

## Common Issues

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your MONGODB_URI
- If using Atlas, verify IP whitelist allows your connection

### Dependencies Not Installing
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
├── client/          # React Frontend (Vite)
├── server/          # Express Backend
├── docs/            # Documentation
└── README.md        # Full documentation
```

## Documentation

- **Setup Guide**: See `docs/SETUP.md`
- **API Docs**: See `docs/API.md`
- **Architecture**: See `docs/ARCHITECTURE.md`
- **Contributing**: See `CONTRIBUTING.md`

## Development Scripts

### Client
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Server
```bash
npm run dev      # Start dev server
npm run build    # Compile TypeScript
npm start        # Start production server
npm run lint     # Run ESLint
```

### Root
```bash
npm run dev           # Start both servers
npm run build         # Build both
npm run build:server  # Build server only
npm run build:client  # Build client only
```

## Next Steps

1. Read the full [README.md](./README.md)
2. Explore the [API documentation](./docs/API.md)
3. Check out the [architecture](./docs/ARCHITECTURE.md)
4. Start building features!

## Need Help?

- Check [CONTRIBUTING.md](./CONTRIBUTING.md)
- Review [documentation](./docs/)
- Open an issue on GitHub

## What's Included?

✅ Full-stack application  
✅ Authentication system (JWT)  
✅ Investment analysis  
✅ Fraud detection algorithm  
✅ Report generation  
✅ Database (MongoDB)  
✅ API documentation  
✅ CI/CD pipeline  
✅ TypeScript setup  
✅ Tailwind CSS styling  

Happy coding! 🚀
