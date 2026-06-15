const express = require('express');
const router = express.Router();

// Start Akinator-style game
router.post('/akinator/start', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // TODO: Initialize game session
    const gameSession = {
      gameId: 'game_' + Date.now(),
      question: 'Is it a person?',
      questionNumber: 1,
      possibleAnswers: []
    };
    
    res.json(gameSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit game answer
router.post('/akinator/answer', async (req, res) => {
  try {
    const { gameId, answer } = req.body;
    
    // TODO: Process answer, generate next question
    
    res.json({ 
      nextQuestion: 'Is it fictional?',
      questionNumber: 2
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
