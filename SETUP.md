# Project Setup Guide

## Quick Start

### Prerequisites
- Node.js 16+ (for frontend)
- Python 3.11+ (for backend)
- MongoDB running locally on port 27017
- npm or yarn

---

## Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Update .env with your values
# Edit frontend/.env and add your Firebase credentials

# 5. Start development server
npm run dev

# Frontend will be available at http://localhost:8080
```

### Frontend Environment Variables
```env
VITE_API_BASE_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=YOUR_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

---

## Backend Setup

### Option 1: Using Python venv

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create environment file
cp .env.example .env

# 6. Update .env with your values
# Edit backend/.env (MongoDB URI, Port, CORS origins)

# 7. Start development server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 4000

# Backend will be available at http://localhost:4000
# API docs at http://localhost:4000/docs
```

### Option 2: Using Docker (Coming Soon)

---

## Backend Environment Variables
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/VishwasX
CORS_ORIGIN=http://localhost:8080,http://localhost:8081,http://localhost:5173
```

---

## Database Setup

Make sure MongoDB is running on your machine:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Windows (if installed via MSI)
# MongoDB runs as a service - start it from Services

# Linux (Ubuntu/Debian)
sudo systemctl start mongod

# Or run with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## Running the Full Stack

### Method 1: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
python -m uvicorn main:app --reload --host 0.0.0.0 --port 4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Method 2: Using the Root package.json

```bash
# From root directory
npm run dev:frontend
```

Then in another terminal:
```bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 4000
```

---

## ML Services Setup

### Phishing Detection Service
```bash
cd ml-services/Phishing

# Create virtual environment
python -m venv .venv

# Activate it
source .venv/bin/activate  # or .\.venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Train the model (optional, pre-trained model may exist)
python train_phishing_model.py --combine-datasets --output-dir ./artifacts

# Run predictions
python predict_phishing.py --url "https://example.com"
```

### Resume Intelligence Service
```bash
cd ml-services/AI-Resume

# Uses same Python environment as backend
# Analyzer module is imported by backend main.py

python train.py  # To train a resume classifier
```

---

## Troubleshooting

### "Module not found" errors
```bash
# Ensure virtual environment is activated
which python  # Should show path inside your venv

# Reinstall dependencies
pip install -r requirements.txt
```

### MongoDB connection errors
```bash
# Check if MongoDB is running
# For local MongoDB:
mongosh  # or mongo for older versions

# If not running, start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux
```

### CORS errors
- Update `CORS_ORIGIN` in backend/.env
- Make sure frontend URL is listed (e.g., http://localhost:8080)

### Port already in use
```bash
# Find process using port 4000
lsof -i :4000  # macOS/Linux
netstat -ano | findstr :4000  # Windows

# Kill the process or change PORT in backend/.env
```

### Environment variables not loading
```bash
# Make sure .env file exists in the right directory
# backend/.env for backend
# frontend/.env for frontend

# Restart the server after creating/modifying .env
```

---

## API Documentation

Once the backend is running, open:
```
http://localhost:4000/docs
```

This opens the auto-generated Swagger UI with all API endpoints.

---

## Project Structure

```
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities (auth, API, etc.)
│   │   └── index.css
│   ├── .env.example       # Copy to .env
│   └── package.json
│
├── backend/              # FastAPI backend
│   ├── main.py           # Main application
│   ├── requirements.txt
│   ├── .env.example      # Copy to .env
│   └── uploads/          # Resume storage
│
├── ml-services/          # ML/AI services
│   ├── Phishing/        # Phishing detection
│   └── AI-Resume/       # Resume analysis
│
└── docs/                # Project documentation
```

---

## Next Steps

1. ✅ Set up frontend and backend
2. ✅ Start both servers
3. Visit http://localhost:8080
4. Create a test account
5. Explore features

---

## Support

For issues or questions:
1. Check PROJECT_AUDIT_REPORT.md for known issues
2. Ensure all environment variables are set
3. Check backend logs for API errors
4. Check browser console for frontend errors

---

**Last Updated**: April 6, 2026
