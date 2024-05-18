const express = require('express');
const router = express.Router();

const Record = require('../models/Record');

//Get all data from db
router.get('/', async (req, res) => {
    res.json(await Record.find());
});

//Add data to db
router.post('/', async (req, res) => {
    const record = new Record(req.body);
    await record.save();
    res.json({state: 'success'});
});

//Update some data in db
router.put('/:id', async (req, res) => {
    await Record.findByIdAndUpdate(req.params.id, req.body);
    res.json({state: 'updated'});
 });

 //Delete some data from db
router.delete('/:id', async (req, res) => {
    await Record.findByIdAndDelete(req.params.id);
    res.json({state: 'deleted'});
});

module.exports = router;