# Underground ID - Architecture Documentation

## System Overview

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Mobile App    │      │   Web App       │      │   AR Glasses    │
│  (React Native) │      │   (React.js)    │      │ (React Native)  │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                        │                        │
         │      WebSocket / REST  │      WebSocket / REST  │
         └────────────────────────┼────────────────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │   Express.js Backend       │
                    │  - Authentication (JWT)    │
                    │  - Chat API                │
                    │  - Voice Processing        │
                    │  - Game Engine             │
                    │  - Device Sync             │
                    └─────────────┬──────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
  ┌────────────┐          ┌──────────────┐          ┌──────────────┐
  │ PostgreSQL │          │ OpenAI API   │          │ Google Cloud │
  │ Database   │          │ (ChatGPT)    │          │ Speech API   │
  └────────────┘          └──────────────┘          └──────────────┘
```

## Component Details

### 1. Frontend Layer

#### Mobile App (React Native)
- Cross-platform iOS/Android
- Voice command listener
- Chat UI
- Device sync handler
- Game UI

#### Web App (React.js)
- Dashboard
- Chat interface
- Settings
- Analytics
- Admin console

#### AR Glasses (React Native + ARCore/ARKit)
- Spatial UI
- Voice-first interaction
- Gesture recognition
- Real-time rendering

### 2. Backend Layer

#### Express.js Server
- RESTful API endpoints
- WebSocket server (Socket.io)
- Request validation
- Error handling
- Rate limiting

#### Key Modules
- **Auth Service**: JWT generation, password hashing
- **Chat Service**: Message processing, OpenAI integration
- **Voice Service**: Speech-to-text, command recognition
- **Game Service**: Akinator logic, score tracking
- **Sync Service**: Multi-device synchronization
- **User Service**: Profile management, preferences

### 3. Data Layer

#### PostgreSQL Database
- User data
- Chat history
- Game progress
- Device tracking
- Voice commands log

#### External Services
- **OpenAI API**: LLM for chat
- **Google Cloud Speech-to-Text**: Voice recognition
- **Firebase/Cloud Storage**: Backup & sync

## Data Flow

### Chat Flow
```
1. Client sends message via REST/WebSocket
2. Backend receives and validates
3. OpenAI API generates response
4. Response saved to database
5. Response sent back to client
6. Sync to other devices via WebSocket
```

### Voice Command Flow
```
1. Client captures audio
2. Sends to voice service
3. Google Cloud converts speech-to-text
4. Backend checks for "High ID" trigger
5. If triggered, executes command
6. Response sent to client
```

### Multi-Device Sync Flow
```
1. User updates data on Device A
2. Device A sends update to backend
3. Backend saves to database
4. Backend notifies Device B & C via WebSocket
5. Devices B & C update locally
6. Sync confirmation sent
```

## Security

### Authentication
- JWT tokens with expiration
- Password hashing with bcryptjs
- Refresh token rotation

### Authorization
- Role-based access control (RBAC)
- Device-specific permissions
- API key management

### Data Protection
- HTTPS encryption
- Database encryption at rest
- Environment variable management
- Input validation & sanitization

### Rate Limiting
- IP-based rate limiting
- User-based rate limiting
- Endpoint-specific limits

## Scalability

### Horizontal Scaling
- Stateless backend servers
- Load balancer distribution
- Database replication
- Redis cache for sessions

### Performance Optimization
- Message queuing (Bull/RabbitMQ)
- Database indexing
- CDN for static assets
- Response caching

## Deployment

### Development
- Local PostgreSQL
- Local Express server
- Hot reload enabled

### Production
- AWS/GCP/Azure deployment
- Docker containerization
- CI/CD pipeline (GitHub Actions)
- Database backups
- Monitoring & logging

## Future Architecture Improvements

1. **Microservices**: Split into separate services (auth, chat, voice, etc.)
2. **Event-Driven**: Message bus for inter-service communication
3. **GraphQL**: Optional GraphQL layer for flexible queries
4. **Machine Learning**: Custom AI models for better voice recognition
5. **Blockchain**: For transparent user data management
