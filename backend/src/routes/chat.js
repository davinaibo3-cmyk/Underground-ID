const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Send chat message
router.post('/message', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    // TODO: Get user chat history from DB
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are Underground ID, a helpful AI assistant.' },
        { role: 'user', content: message }
      ]
    });
    
    const reply = response.choices[0].message.content;
    
    // TODO: Save message and reply to DB
    
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // TODO: Fetch from DB
    const history = [];
    
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
