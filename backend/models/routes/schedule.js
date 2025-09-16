const express = require('express');
const router = express.Router();
const Train = require('../models/Train');
const TrackSection = require('../models/TrackSection');


// POST /api/schedule/optimize
// Body: { horizonMinutes: 120 }
// Returns a proposed schedule (mock/greedy) that assigns ETA/ETD per section.
router.post('/optimize', async (req, res) => {
const { horizonMinutes = 180 } = req.body || {};


// load trains and sections
const trains = await Train.find().lean();
const sections = await TrackSection.find().lean();


// very simple greedy scheduler: sort trains by priority desc, then assign sequentially to sections
const now = new Date();
const schedulePlan = [];


// sort trains: higher priority first, then earlier creation
trains.sort((a,b)=> (b.priority||0) - (a.priority||0));


// maintain nextFreeTime per section
const nextFree = {};
sections.forEach(s => { nextFree[s.sectionId] = new Date(now); });


for (const train of trains) {
// assign train across all sections sequentially with simple travel time = lengthKm * 2 minutes/km (mock)
const assigned = [];
let tstart = new Date(now);


for (const s of sections) {
const travelMin = Math.max(1, Math.round((s.lengthKm || 1) * 2));
// start when section free and when train available
const start = new Date(Math.max(nextFree[s.sectionId].getTime(), tstart.getTime()));
const end = new Date(start.getTime() + travelMin*60*1000 + (s.safetyBufferSec||60)*1000);


assigned.push({ sectionId: s.sectionId, eta: start, etd: end });


// update next free
nextFree[s.sectionId] = new Date(end);
tstart = new Date(end.getTime());
}


schedulePlan.push({ trainId: train.trainId, assigned });
}


// For convenience, return a human-friendly JSON
res.json({ generatedAt: now, horizonMinutes, schedulePlan });
});


module.exports = router;