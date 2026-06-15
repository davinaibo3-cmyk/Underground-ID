const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');

// Send chat message
router.post('/message', async (req, res) => {
  try {
    const { message, userId, language = 'en', conversationHistory = [] } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: 'Message and userId required' });
    }

    const result = await chatService.processMessage(
      message,
      userId,
      language,
      conversationHistory
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, language = 'en' } = req.query;

    // TODO: Fetch from database
    const history = [];

    res.json({ history, userId, language });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Summarize conversation
router.post('/summarize', async (req, res) => {
  try {
    const { messages, language = 'en' } = req.body;

    const summary = await chatService.summarizeConversation(messages, language);

    res.json({ summary, language });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
