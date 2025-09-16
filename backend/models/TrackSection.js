const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

const TrackSectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true, unique: true },
  lengthKm: { type: Number, required: true },
  maxCapacity: { type: Number, default: 1 },
  safetyBufferSec: { type: Number, default: 60 },
  startLocation: { type: LocationSchema, required: true },
  endLocation: { type: LocationSchema, required: true },
  status: { type: String, enum: ['OPERATIONAL', 'MAINTENANCE', 'BLOCKED'], default: 'OPERATIONAL' },
  signalState: { type: String, enum: ['GREEN', 'YELLOW', 'RED'], default: 'GREEN' },
  currentOccupancy: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TrackSection', TrackSectionSchema);