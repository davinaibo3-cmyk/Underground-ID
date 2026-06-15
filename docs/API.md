# Underground ID - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "token": "eyJhbGc..."
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## Chat Endpoints

### Send Message
```http
POST /chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Hello, what can you do?",
  "userId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "userMessage": "Hello, what can you do?",
  "assistantReply": "I'm Underground ID, your AI assistant...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Chat History
```http
GET /chat/history/:userId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "history": [
    {
      "id": 1,
      "message": "Hello",
      "role": "user",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "message": "Hi! How can I help?",
      "role": "assistant",
      "timestamp": "2024-01-15T10:30:05Z"
    }
  ]
}
```

---

## Voice Endpoints

### Process Voice Command
```http
POST /voice/command
Authorization: Bearer <token>
Content-Type: application/json

{
  "audioData": "base64_encoded_audio",
  "userId": 1
}
```

**Response:**
```json
{
  "recognized": true,
  "command": "start_chat",
  "response": "Starting chat..."
}
```

### Detect Voice Activation
```http
POST /voice/detect
Content-Type: application/json

{
  "audioData": "base64_encoded_audio"
}
```

**Response:**
```json
{
  "activated": true,
  "confidence": 0.95
}
```

---

## User Endpoints

### Get Profile
```http
GET /user/profile/:userId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "devices": [
    {
      "id": 1,
      "type": "mobile",
      "name": "iPhone 15",
      "lastSync": "2024-01-15T10:30:00Z"
    }
  ],
  "preferences": {
    "theme": "dark",
    "language": "en"
  }
}
```

### Update Profile
```http
PUT /user/profile/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "preferences": {
    "theme": "light"
  }
}
```

---

## Game Endpoints

### Start Akinator Game
```http
POST /games/akinator/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 1
}
```

**Response:**
```json
{
  "gameId": "game_1705324200000",
  "question": "Is it a person?",
  "questionNumber": 1
}
```

### Submit Answer
```http
POST /games/akinator/answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "gameId": "game_1705324200000",
  "answer": "yes"
}
```

**Response:**
```json
{
  "nextQuestion": "Is it fictional?",
  "questionNumber": 2,
  "gameId": "game_1705324200000"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Missing or invalid token"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## WebSocket Events

### Connect
```javascript
socket.on('connect', () => {
  console.log('Connected to Underground ID');
});
```

### Chat Message (Real-time)
```javascript
// Emit
socket.emit('chat:message', {
  message: 'Hello',
  userId: 1
});

// Listen
socket.on('chat:message', (data) => {
  console.log('Message:', data);
});
```

### Device Sync
```javascript
socket.on('sync:update', (data) => {
  console.log('Sync update:', data);
});
```

---

## Rate Limiting

- Default: 100 requests per minute per IP
- Auth endpoints: 5 requests per minute
- Chat endpoints: 30 requests per minute

---

## Status Codes

| Code | Meaning |
|------|----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |
