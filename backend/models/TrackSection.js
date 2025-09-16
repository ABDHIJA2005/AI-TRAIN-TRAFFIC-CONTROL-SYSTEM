const mongoose = require('mongoose');


const TrackSectionSchema = new mongoose.Schema({
sectionId: { type: String, required: true, unique: true },
lengthKm: Number,
maxCapacity: { type: Number, default: 1 }, // how many trains can occupy (usually 1)
occupiedBy: [{ trainId: String, from: Date, to: Date }],
safetyBufferSec: { type: Number, default: 60 }
}, { timestamps: true });


module.exports = mongoose.model('TrackSection', TrackSectionSchema);