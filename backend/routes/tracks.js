const express = require('express');
const router = express.Router();
const TrackSection = require('../models/TrackSection');


router.get('/', async (req, res) => {
const list = await TrackSection.find().lean();
res.json(list);
});


router.post('/', async (req, res) => {
try {
const t = new TrackSection(req.body);
await t.save();
res.status(201).json(t);
} catch(e) { res.status(400).json({ error: e.message }); }
});


router.get('/:id', async (req, res) => {
const s = await TrackSection.findOne({ sectionId: req.params.id });
if(!s) return res.status(404).json({ error: 'not found' });
res.json(s);
});


router.put('/:id', async (req, res) => {
const s = await TrackSection.findOneAndUpdate({ sectionId: req.params.id }, req.body, { new: true });
res.json(s);
});


router.delete('/:id', async (req, res) => {
await TrackSection.deleteOne({ sectionId: req.params.id });
res.json({ ok: true });
});


module.exports = router;