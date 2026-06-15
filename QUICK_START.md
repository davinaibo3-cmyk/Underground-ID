# 🚀 Underground ID - Quick Start

## Setup (5 minutes)

### Step 1: Clone & Install
```bash
git clone https://github.com/davinaibo3-cmyk/underground-id.git
cd underground-id
npm run install:all
```

### Step 2: Environment
```bash
cp backend/.env.example backend/.env
# Add your OpenAI API key
```

### Step 3: Docker
```bash
docker-compose up -d
```

### Step 4: Start Dev
```bash
cd backend && npm run dev
cd frontend/mobile && npm start
```

### Step 5: Test
- Backend: http://localhost:5000/api/health
- Frontend: Scan QR code in terminal

## Features
✅ Voice Activation ("High ID")
✅ Multi-Device Sync
✅ ChatGPT Integration
✅ Real-Time Chat
✅ Games (Akinator)
✅ User Profiles

## Deployment
```bash
# Docker
docker build -t underground-id .
docker run -p 5000:5000 underground-id

# Heroku
git push heroku main
```

**Happy coding!** 🚀
