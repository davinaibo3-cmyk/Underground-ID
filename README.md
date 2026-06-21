# Underground ID 🎯

**Underground ID** is an AI-powered ChatGPT platform with voice command activation ("High ID") that works seamlessly across all devices - smartphones, smart glasses, tablets, and more.

## Vision

🌍 Build a globally recognized AI brand that:
- Responds to voice command: **"High ID"**
- Functions across ALL devices (mobile, AR glasses, web, wearables)
- Provides ChatGPT-like conversational AI
- Includes interactive game modes (Akinator-style)
- Syncs user data across devices in real-time

## Features (Planned)

✅ Voice Command Activation ("High ID")  
✅ Multi-Device Synchronization  
✅ ChatGPT-like Conversational AI  
✅ Interactive Question Games (Akinator-mode)  
✅ User Authentication & Profiles  
✅ Cloud-based Storage  
✅ AR Glass Support  
✅ Real-time Chat History Sync  

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI API
- **Voice Processing**: Google Cloud Speech-to-Text / Web Speech API

### Frontend
- **Mobile/Web**: React Native
- **Web Dashboard**: React.js
- **AR Glasses**: React Native + AR-specific libraries
- **State Management**: Redux
- **Real-time**: Socket.io

## Project Structure

```
underground-id/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── config/
│   ├── database/
│   └── .env.example
├── frontend/
│   ├── mobile/
│   ├── web/
│   └── ar/
├── docs/
├── tests/
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/davinaibo3-cmyk/underground-id.git
cd underground-id

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend/mobile
npm install
```

### Environment Setup

```bash
# Create .env file in backend/
cp backend/.env.example backend/.env

# Add your credentials:
# OPENAI_API_KEY=your_key
# DATABASE_URL=postgresql://...
# JWT_SECRET=your_secret
```

### Running the Project

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend/mobile
npm start
```

## API Endpoints

See [API Documentation](./docs/API.md) for detailed endpoint specs.

### Core Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history` - Get chat history
- `POST /api/voice/command` - Process voice commands
- `GET /api/user/profile` - Get user profile
- `POST /api/games/akinator/start` - Start Akinator game

## Voice Command System

### Activation
- **Command**: "High ID"
- **Response**: App wakes up and listens for commands
- **Processing**: Google Cloud Speech-to-Text / Web Speech API

### Example Commands
- "High ID, start a chat"
- "High ID, play a game"
- "High ID, show my profile"

## Multi-Device Synchronization

All user data syncs across devices:
- Chat history
- User preferences
- Game progress
- Settings

Sync happens via:
- WebSocket (real-time)
- REST API (periodic)
- Cloud storage (backup)

## Development Roadmap

### Phase 1 (MVP)
- [x] Project setup
- [ ] Backend API core
- [ ] Authentication system
- [ ] Chat endpoint
- [ ] Mobile app basic UI

### Phase 2
- [ ] Voice command integration
- [ ] Multi-device sync
- [ ] Game system (Akinator)
- [ ] User profiles

### Phase 3
- [ ] AR glasses support
- [ ] Advanced AI features
- [ ] Analytics dashboard
- [ ] Production deployment

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Contact & Support

📧 Email: support@undergroundid.com  
🌐 Website: https://undergroundid.com  
💬 Discord: [Coming Soon]

---

**Build Underground ID. Shape the Future.** 🚀
Konzepts für Hi-ID: Erstens, die zwei Persönlichkeiten Ibo und Davina. Zweitens, die nahtlose Integration von Google-Diensten. Drittens, der Internet-Super-Joker für Notfälle. Viertens, eine Sprach-Stimmungsanalyse. Fünftens, Vernetzung im Verkehr und Business. Sechstens, finanzielle Lösungsansätze für Wohlstand. Siebtens, Flughafen- und Nahverkehrs-Integration mit automatischer Buchung. Und achtens, umfassende Sprachsteuerung für Barrierefreiheit kombiniert mit verschiedenen Feedback-Signalen. 