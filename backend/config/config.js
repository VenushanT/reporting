const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/crime-reporting',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  googleAI: {
    apiKey: process.env.GOOGLE_AI_API_KEY,
    model: 'gemini-1.5-flash',
    maxOutputTokens: 2048,
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
  },
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  }
}; 