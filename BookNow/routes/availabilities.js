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

// get all availabilities for a provider
router.get('/providers/:provID', async (req, res) => {
    const availabilities = await Availability.find({provider: req.params.provID});
    console.log(availabilities);
    res.send(availabilities);
});

// get all availabilities for a provider at a specific date
router.get('/providers/:provID/:date', async (req, res) => {
    const availabilities = await Availability.find({provider: req.params.provID, date: req.params.date});
    console.log(availabilities);
    res.send(availabilities);
});

// get all availabilities at a specific date
router.get('/:date', async (req, res) => {
    const availabilities = await Availability.find({date: req.params.date});
    console.log(availabilities);
    res.send(availabilities);
});

// get all availabilities including provider info at a specific date
router.get('/:date/providers', async (req, res) => {
    const availabilities = await Availability.find({date: req.params.date}).populate('provider');
    console.log(availabilities);
    res.send(availabilities);
});

// ===================================== POST =====================================
// add a new availability
router.post('/', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'createAvailability');
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

// ===================================== PUT =====================================
// update availability info
router.put('/:id', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateAvailability');
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find availability to update
        const availability = await Availability.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    provider: req.body.provider,
                    date: req.body.date,
                    availableHours: req.body.availableHours
                }
            }
        );

        // if no availability of this id
        if (!availability) return res.status(400).send("No availability of this id exists.");

        console.log(availability);
        res.send(availability);
    } catch (e) {
        return res.status(400).send("No availability of this id exists.");
    }
});

// ------------------------------------- Hours -------------------------------------
// add new availability hour
router.put('/:id/hours/add', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateAvailabilityHour');
    if (error) return res.status(400).send(error.details[0].message);

    // create a new hour
    const availableHour = {
        hour: parseInt(req.body.hour)
    };

    try {
        // find availability to update
        const availability = await Availability.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    availableHours: availableHour
                }
            }
        );

        // if no availability of this id
        if (!availability) return res.status(400).send("No availability of this id exists.");

        console.log(availability);
        res.send(availability);
    } catch (e) {
        return res.status(400).send("No availability of this id exists.");
    }
});

// delete an availability hour
router.put('/:id/hours/remove/:hourID', async (req, res) => {
    try {
        // find availability to update
        const availability = await Availability.findByIdAndUpdate(req.params.id,
            {
                $pull: {
                    availableHours: {_id: req.params.hourID}
                }
            }
        );

        // if no availability of this id
        if (!availability) return res.status(400).send("No availability of this id exists.");

        console.log(availability);
        res.send(availability);
    } catch (e) {
        return res.status(400).send("No availability of this id exists.");
    }
});

// ===================================== DELETE =====================================
// delete an availability by id
router.delete('/:id', async (req, res) => {
    try {
        const availability = await Availability.findByIdAndDelete(req.params.id);

        if (!availability) return res.status(400).send("No availability of this id exists.");
        console.log(availability);
        res.send(availability);
    } catch (e) {
        return res.status(400).send("No availability of this id exists.");
    }
});

// export router
module.exports = router;