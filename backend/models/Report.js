const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportType: {
    type: String,
    required: true,
    enum: ['theft', 'vandalism', 'accident', 'suspicious', 'other']
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  imageUrl: {
    type: String
  },
  imageAnalysis: {
    suggestedReportType: String,
    description: String,
    confidence: Number
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a 2dsphere index for location queries
reportSchema.index({ location: '2dsphere' });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report; 