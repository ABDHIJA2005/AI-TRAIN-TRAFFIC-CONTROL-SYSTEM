const mongoose = require('mongoose');
const config = require('./config');
const Train = require('./models/Train');
const TrackSection = require('./models/TrackSection');

async function seed() {
  await mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  await Train.deleteMany({});
  await TrackSection.deleteMany({});

  await TrackSection.insertMany([
    {
      sectionId: 'S1',
      lengthKm: 5,
      maxCapacity: 1,
      safetyBufferSec: 60,
      startLocation: { latitude: 12.9716, longitude: 77.5946 }, // Bengaluru
      endLocation: { latitude: 12.9816, longitude: 77.6046 }
    },
    {
      sectionId: 'S2',
      lengthKm: 3,
      maxCapacity: 1,
      safetyBufferSec: 60,
      startLocation: { latitude: 12.9816, longitude: 77.6046 },
      endLocation: { latitude: 13.0827, longitude: 80.2707 } // Chennai
    },
    {
      sectionId: 'S3',
      lengthKm: 4,
      maxCapacity: 1,
      safetyBufferSec: 60,
      startLocation: { latitude: 13.0827, longitude: 80.2707 },
      endLocation: { latitude: 13.0927, longitude: 80.2807 }
    }
  ]);

  await Train.insertMany([
    { trainId: 'T100', name: 'Express-100', type: 'EXPRESS', priority: 10 },
    { trainId: 'T200', name: 'Passenger-200', type: 'PASSENGER', priority: 5 },
    { trainId: 'T300', name: 'Freight-300', type: 'FREIGHT', priority: 2 }
  ]);

  console.log('Seeded DB');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });