const express = require('express');
const router = express.Router();
const Train = require('../models/Train');


// list trains
router.get('/', async (req, res) => {
const list = await Train.find().lean();
res.json(list);
});


// create train
router.post('/', async (req, res) => {
const data = req.body;
try {
const t = new Train(data);
await t.save();
res.status(201).json(t);
} catch (e) { res.status(400).json({ error: e.message }); }
});


// get one
router.get('/:id', async (req, res) => {
const t = await Train.findOne({ trainId: req.params.id });
if(!t) return res.status(404).json({ error: 'not found' });
res.json(t);
});


// update
router.put('/:id', async (req, res) => {
const t = await Train.findOneAndUpdate({ trainId: req.params.id }, req.body, { new: true });
res.json(t);
});


// delete
router.delete('/:id', async (req, res) => {
await Train.deleteOne({ trainId: req.params.id });
res.json({ ok: true });
});


module.exports = router;