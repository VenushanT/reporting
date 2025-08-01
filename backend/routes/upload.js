const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Initialize Google AI
const genAI = new GoogleGenerativeAI(config.googleAI.apiKey);

// We'll use gemini-pro-vision as it's a stable model that's definitely available
const MODEL_NAME = 'gemini-1.5-flash';

// Get the model with configuration
const model = genAI.getGenerativeModel({ 
  model: MODEL_NAME,
  generationConfig: {
    maxOutputTokens: config.googleAI.maxOutputTokens,
    temperature: config.googleAI.temperature,
    topK: config.googleAI.topK,
    topP: config.googleAI.topP,
  }
});

// Upload and analyze image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Convert image buffer to base64
    const imageData = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    // Log the model being used
    console.log(`Using model: ${MODEL_NAME}`);

    // Generate content using Google AI
    const result = await model.generateContent([
      {
        inlineData: {
          data: imageData,
          mimeType: mimeType
        }
      },
      {
        text: "Analyze this image and provide a detailed description of what you see. Also, determine the most appropriate report type from these options: 'theft', 'vandalism', 'accident', 'suspicious', or 'other'. Format your response as follows:\n\nDescription: [detailed description]\nReport Type: [one of the specified types]"
      }
    ]);

    const response = await result.response;
    const analysisText = response.text();

    // Parse the response to extract report type and description
    const descriptionMatch = analysisText.match(/Description:([\s\S]*?)(?=Report Type:|$)/i);
    const reportTypeMatch = analysisText.match(/Report Type:\s*(\w+)/i);

    const description = descriptionMatch ? descriptionMatch[1].trim() : analysisText;
    const suggestedReportType = reportTypeMatch ? reportTypeMatch[1].toLowerCase() : 'other';

    // Validate the report type
    const validTypes = ['theft', 'vandalism', 'accident', 'suspicious', 'other'];
    const finalReportType = validTypes.includes(suggestedReportType) ? suggestedReportType : 'other';
    
    // For now, we'll use a placeholder URL for the image
    // In a production environment, you would upload this to a cloud storage service
    const imageUrl = `data:${mimeType};base64,${imageData}`;

    res.json({
      analysis: {
        suggestedReportType: finalReportType,
        description: description,
        confidence: 0.8, // Placeholder confidence score
        imageUrl,
        modelUsed: MODEL_NAME // Include which model was used in the response
      }
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.message 
    });
  }
});

module.exports = router; 