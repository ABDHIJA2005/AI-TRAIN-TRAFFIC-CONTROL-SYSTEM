const mongoose = require('mongoose');

const HistoricalPerformanceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  delayMinutes: Number,
  cause: String
});

const ScheduleEntrySchema = new mongoose.Schema({
  sectionId: { type: String, required: true },
  eta: { type: Date, required: true },
  etd: { type: Date, required: true }
});

const TrainSchema = new mongoose.Schema({
  trainId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['PASSENGER', 'EXPRESS', 'FREIGHT'], default: 'PASSENGER' },
  priority: { type: Number, default: 1 },
  schedule: [ScheduleEntrySchema],
  currentSection: { type: String, default: null },
  currentLocation: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 }
  },
  currentSpeed: { type: Number, default: 0 },
  status: { type: String, enum: ['SCHEDULED', 'RUNNING', 'STOPPED', 'COMPLETED', 'DELAYED'], default: 'SCHEDULED' },
  historicalPerformance: [HistoricalPerformanceSchema]
}, { timestamps: true });

module.exports = mongoose.model('Train', TrainSchema);