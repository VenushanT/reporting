const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Create a new report
router.post('/', async (req, res) => {
  try {
    const { reportType, description, location, imageUrl, imageAnalysis } = req.body;

    // Validate required fields
    if (!reportType || !description || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new report
    const report = new Report({
      reportType,
      description,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      imageUrl,
      imageAnalysis,
      status: 'pending',
      createdAt: new Date()
    });

    // Save report to database
    await report.save();

    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Error creating report' });
  }
});

// Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Error fetching reports' });
  }
});

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Error fetching report' });
  }
});

// Get reports within a radius (in meters)
router.get('/nearby', async (req, res) => {
  try {
    const { longitude, latitude, radius = 5000 } = req.query;
    
    const reports = await Report.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).sort({ timestamp: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 