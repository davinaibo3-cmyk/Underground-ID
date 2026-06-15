const express = require('express');
const router = express.Router();
const voiceService = require('../services/voiceService');

// Process voice command with language detection
router.post('/command', async (req, res) => {
  try {
    const { audioData, userId, language = 'en' } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'Audio data required' });
    }

    const result = await voiceService.processCommand(audioData, language);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detect voice activation
router.post('/detect', async (req, res) => {
  try {
    const { audioData, language = 'en' } = req.body;

    const result = await voiceService.detectActivation(audioData, language);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Speech to text
router.post('/transcribe', async (req, res) => {
  try {
    const { audioData, language = 'en' } = req.body;

    const result = await voiceService.speechToText(audioData, language);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Text to speech
router.post('/speak', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;

    const result = await voiceService.textToSpeechGeneration(text, language);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
