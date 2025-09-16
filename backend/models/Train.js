const mongoose = require('mongoose');


const TrainSchema = new mongoose.Schema({
trainId: { type: String, required: true, unique: true },
name: String,
type: { type: String, enum: ['PASSENGER','EXPRESS','FREIGHT'], default: 'PASSENGER' },
priority: { type: Number, default: 1 }, // higher -> higher priority
schedule: [{ sectionId: String, eta: Date, etd: Date }],
currentSection: { type: String, default: null },
status: { type: String, enum: ['SCHEDULED','RUNNING','STOPPED','COMPLETED'], default: 'SCHEDULED' }
}, { timestamps: true });


module.exports = mongoose.model('Train', TrainSchema);