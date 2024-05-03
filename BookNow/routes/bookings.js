const mongoose = require('mongoose');
const { Booking, validate } = require('../models/bookings');
const express = require('express');
const router = express.Router();

// ===================================== GET =====================================
// get all bookings
router.get('/', async (req, res) => {
    const bookings = await Booking.find();
    console.log(bookings);
    res.send(bookings);
});

// ===================================== POST =====================================
// add a new booking
router.post('/', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'createBooking');
    if (error) return res.status(400).send(error.details[0].message);

    // create a new booking
    const booking = new Booking({
        client: req.body.client,
        provider: req.body.provider,
        service: req.body.service,
        date: req.body.date,
        address: req.body.address,
        payment: req.body.payment,
        recipient: req.body.recipient,
    });

    try {
        const result = await booking.save();
        console.log(result);
        res.send(result);
    } catch (ex) {
        console.log(ex.message);
        res.status(400).send(ex.message);
    }
});

// export router
module.exports = router;