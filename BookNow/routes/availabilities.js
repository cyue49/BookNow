const mongoose = require('mongoose');
const { Availability, validate } = require('../models/availabilities');
const express = require('express');
const router = express.Router();

// ===================================== GET =====================================
// get all availabilities
router.get('/', async (req, res) => {
    const availabilities = await Availability.find();
    console.log(availabilities);
    res.send(availabilities);
});

// get all availabilities inlcuding provider info
router.get('/providers', async (req, res) => {
    const availabilities = await Availability.find().populate('provider');
    console.log(availabilities);
    res.send(availabilities);
});

// ===================================== POST =====================================
// add a new availability
router.post('/', async (req, res) => {
    // input validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // create a new availability
    const availability = new Availability({
        provider: req.body.provider,
        date: req.body.date,
        availableHours: req.body.availableHours
    });

    try {
        const result = await availability.save();
        console.log(result);
        res.send(result);
    } catch (ex) {
        console.log(ex.message);
        res.status(400).send(ex.message);
    }
});

// export router
module.exports = router;