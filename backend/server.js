const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');


const trainsRoute = require('./routes/trains');
const tracksRoute = require('./routes/tracks');
const scheduleRoute = require('./routes/schedule');


async function start() {
await mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('Connected to MongoDB');


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api/trains', trainsRoute);
app.use('/api/tracks', tracksRoute);
app.use('/api/schedule', scheduleRoute);


app.listen(config.port, () => console.log(`Server running on ${config.port}`));
}


start().catch(err => console.error(err));