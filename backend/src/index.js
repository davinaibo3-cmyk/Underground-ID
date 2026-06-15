const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');
const i18n = require('i18n');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// i18n Configuration
i18n.configure({
  locales: ['en', 'de', 'fr', 'es', 'it', 'pt', 'ja', 'zh'],
  defaultLocale: 'en',
  directory: path.join(__dirname, '../locales'),
  updateFiles: false,
  indent: '\t',
  extension: '.json',
  prefix: 't_'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18n.init);

// Language Selection Middleware
app.use((req, res, next) => {
  const lang = req.query.lang || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
  i18n.setLocale(lang);
  req.language = lang;
  res.setLocale(lang);
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Underground ID Backend is running ✅',
    version: '1.0.0',
    language: req.language,
    timestamp: new Date().toISOString()
  });
});

// Status Endpoint
app.get('/api/status', (req, res) => {
  res.json({
    app: 'Underground ID',
    status: 'active',
    services: {
      ai: 'OpenAI GPT-3.5-turbo',
      voice: 'Google Cloud Speech-to-Text',
      database: 'PostgreSQL',
      realtime: 'Socket.io',
      cache: 'Redis'
    },
    languages: ['en', 'de', 'fr', 'es', 'it', 'pt', 'ja', 'zh'],
    features: ['chat', 'voice', 'games', 'multidevice', 'sync'],
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/voice', require('./routes/voice'));
app.use('/api/user', require('./routes/user'));
app.use('/api/games', require('./routes/games'));
app.use('/api/sync', require('./routes/sync'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: req.t('error_occurred'),
    message: err.message,
    status: err.status || 500
  });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);
  
  socket.on('chat:message', (data) => {
    console.log('💬 Message received:', data);
    io.emit('chat:message', { ...data, timestamp: new Date() });
  });

  socket.on('voice:activated', (data) => {
    console.log('🎤 Voice activated:', data);
    io.emit('voice:activated', { ...data, timestamp: new Date() });
  });

  socket.on('sync:device', (data) => {
    console.log('📱 Device sync:', data);
    io.emit('sync:device', { ...data, timestamp: new Date() });
  });
  
  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Underground ID Backend running on http://localhost:${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/api/status`);
  console.log(`🌍 Languages: en, de, fr, es, it, pt, ja, zh\n`);
});

module.exports = { app, io };
