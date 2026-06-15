const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');
const cache = require('memory-cache');

// Send chat message with caching
router.post('/message', async (req, res) => {
  try {
    const { message, userId, language = 'en', conversationHistory = [] } = req.body;

    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Message and userId required',
        code: 'MISSING_PARAMS'
      });
    }

    // Check cache
    const cacheKey = `${userId}-${message}-${language}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        ...cached,
        fromCache: true
      });
    }

    const result = await chatService.processMessage(
      message,
      userId,
      language,
      conversationHistory
    );

    // Cache for 5 minutes
    cache.put(cacheKey, result, 5 * 60 * 1000);

    res.json({
      success: true,
      ...result,
      fromCache: false
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: 'CHAT_ERROR'
    });
  }
});

// Get chat history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, language = 'en' } = req.query;

    // TODO: Fetch from database
    const history = [
      {
        id: 1,
        role: 'assistant',
        message: 'Welcome to Underground ID!',
        language: language,
        timestamp: new Date(Date.now() - 3600000)
      }
    ];

    res.json({
      success: true,
      userId,
      language,
      count: history.length,
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Summarize conversation
router.post('/summarize', async (req, res) => {
  try {
    const { messages, language = 'en' } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array required'
      });
    }

    const summary = await chatService.summarizeConversation(messages, language);

    res.json({
      success: true,
      summary,
      language,
      messageCount: messages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear conversation
router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // TODO: Delete from database
    cache.clear();

    res.json({
      success: true,
      message: 'Conversation cleared',
      userId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
