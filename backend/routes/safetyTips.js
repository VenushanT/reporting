const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

const genAI = new GoogleGenerativeAI(config.googleAI.apiKey);
const MODEL_NAME = 'gemini-1.5-flash';

const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig: {
    maxOutputTokens: config.googleAI.maxOutputTokens,
    temperature: config.googleAI.temperature,
    topK: config.googleAI.topK,
    topP: config.googleAI.topP,
  }
});

// POST /api/safety-tips/ai
router.post('/ai', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const prompt = `A user has described the following emergency or medical need: "${message}"\n\nProvide clear, practical, and compassionate safety tips or first aid advice for this situation. If it is a medical emergency, remind them to call emergency services. Format your response in short, easy-to-read sentences.`;
    const result = await model.generateContent([ { text: prompt } ]);
    const response = await result.response;
    const aiText = response.text();
    res.json({ response: aiText });
  } catch (error) {
    console.error('AI Safety Tip Error:', error);
    res.status(500).json({ error: 'Failed to get safety tip', details: error.message });
  }
});

module.exports = router; 