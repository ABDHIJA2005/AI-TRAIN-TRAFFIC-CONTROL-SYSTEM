const express = require('express');
const router = express.Router();
const Train = require('../models/Train');
const TrackSection = require('../models/TrackSection');
const mongoose = require('mongoose');

// This function simulates a call to an external AI/Optimization microservice.
// In a real-world scenario, this would be an HTTP request to a Python service
// running a Constraint Programming (CP) or Machine Learning model.
async function callOptimizationEngine(trains, tracks) {
  console.log('--- Calling external AI optimization engine ---');
  // Simulating a computationally intensive task with a delay
  await new Promise(resolve => setTimeout(resolve, 2000)); 

  // In a real-world app, the external service would return a full, optimized schedule.
  // This is a placeholder for a sample optimized schedule.
  const optimizedSchedule = [
    { 
      trainId: 'T100', 
      schedule: [
        { sectionId: 'S1', eta: new Date(Date.now() + 60000), etd: new Date(Date.now() + 120000) },
        { sectionId: 'S2', eta: new Date(Date.now() + 180000), etd: new Date(Date.now() + 240000) }
      ],
      status: 'SCHEDULED'
    },
    { 
      trainId: 'T200', 
      schedule: [
        { sectionId: 'S1', eta: new Date(Date.now() + 120000), etd: new Date(Date.now() + 180000) },
        { sectionId: 'S3', eta: new Date(Date.now() + 300000), etd: new Date(Date.now() + 360000) }
      ],
      status: 'SCHEDULED'
    }
  ];

  console.log('--- Optimization complete. Returning new schedule. ---');
  return optimizedSchedule;
}

// POST endpoint to trigger the optimization process
router.post('/run-optimization', async (req, res) => {
  try {
    const trains = await Train.find({});
    const tracks = await TrackSection.find({});

    const optimizedSchedule = await callOptimizationEngine(trains, tracks);
    
    // Update the database with the new schedules
    for (const trainData of optimizedSchedule) {
      await Train.updateOne({ trainId: trainData.trainId }, { 
        $set: { schedule: trainData.schedule, status: 'SCHEDULED' } 
      });
    }

    res.json({ message: 'Optimization triggered successfully. New schedule generated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET endpoint to retrieve the current schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Train.find({}, 'trainId name schedule status currentSection');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;