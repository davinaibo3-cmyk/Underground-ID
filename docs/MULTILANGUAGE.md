# 🌍 Underground ID - Multi-Language Support Guide

## Supported Languages

| Language | Code | Region |
|----------|------|--------|
| English | `en` | 🇬🇧 Global |
| Deutsch | `de` | 🇩🇪 Germany |
| Français | `fr` | 🇫🇷 France |
| Español | `es` | 🇪🇸 Spain |
| Italiano | `it` | 🇮🇹 Italy |
| Português | `pt` | 🇵🇹 Portugal |
| 日本語 | `ja` | 🇯🇵 Japan |
| 中文 | `zh` | 🇨🇳 China |

## Language Detection

### Auto-Detection
```bash
# Based on browser language
Accept-Language: de-DE,de;q=0.9,en;q=0.8

# Result: German (de)
```

### Manual Selection
```javascript
// Query parameter
GET /api/chat/message?lang=de

// Request body
POST /api/chat/message
{
  "message": "Hallo",
  "language": "de"
}
```

## Voice Commands by Language

**English**: "High ID", "Hi ID"
**Deutsch**: "High ID", "Hi ID"
**Français**: "High ID", "ID Souterrain"
**Español**: "High ID", "ID Subterráneo"
**Italiano**: "High ID", "ID Sotterraneo"
**Português**: "High ID", "ID Subterrâneo"
**日本語**: "ハイアイディー"
**中文**: "海ID", "高ID"

## API Response Examples

### English Response
```json
{
  "reply": "Hello! How can I help you today?",
  "language": "en",
  "timestamp": "2024-06-15T12:00:00Z"
}
```

### German Response
```json
{
  "reply": "Hallo! Wie kann ich dir heute helfen?",
  "language": "de",
  "timestamp": "2024-06-15T12:00:00Z"
}
```

## Frontend Implementation

### Language Selector
```javascript
const LANGUAGES = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'fr', label: '🇫🇷 Français' },
  // ... more languages
];

// Change language
setLanguage('de');
```

### Send Message with Language
```javascript
await axios.post(`${API_BASE_URL}/chat/message`, {
  message: "Hallo",
  userId: 1,
  language: "de"
});
```

## Adding New Languages

1. **Add to Backend** (`backend/src/services/chatService.js`)
   ```javascript
   systemPrompts['pt-br'] = 'Você é Underground ID...';
   ```

2. **Add to Frontend** (`frontend/mobile/src/screens/ChatScreen.js`)
   ```javascript
   { code: 'pt-br', label: '🇧🇷 Português BR' }
   ```

3. **Update Voice Service** (`backend/src/services/voiceService.js`)
   ```javascript
   activationPhrases['pt-br'] = ['high id', 'id subterrâneo'];
   ```

## Testing Languages

```bash
# Test German
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hallo",
    "userId": 1,
    "language": "de"
  }'

# Test Japanese
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "こんにちは",
    "userId": 1,
    "language": "ja"
  }'
```

## Performance Tips

- Cache translations
- Pre-load language data
- Use CDN for locale files
- Optimize speech recognition

---

**Supported: 8 Languages | Real-time Translation | Voice Recognition**
