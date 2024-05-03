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

// get all bookings including provider/client/service info
router.get('/showInfo', async (req, res) => {
    const bookings = await Booking.find()
        .populate('client')
        .populate('provider')
        .populate('service');
    console.log(bookings);
    res.send(bookings);
});

// get a specific bookings by id
router.get('/:id', async (req, res) => {
    const booking = await Booking.find({ _id: req.params.id });
    console.log(booking);
    res.send(booking);
});

// get a specific bookings by id including provider/client/service info
router.get('/:id/showInfo', async (req, res) => {
    const booking = await Booking.find({ _id: req.params.id })
        .populate('client')
        .populate('provider')
        .populate('service');
    console.log(booking);
    res.send(booking);
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
        recipient: req.body.recipient
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

// ===================================== PUT =====================================
// update booking info
router.put('/:id', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateBooking');
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find booking to update
        const booking = await Booking.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    client: req.body.client,
                    provider: req.body.provider,
                    service: req.body.service,
                    date: req.body.date,
                    address: req.body.address,
                    payment: req.body.payment,
                    recipient: req.body.recipient
                }
            }
        );

        // if no booking of this id
        if (!booking) return res.status(400).send("No booking of this id exists.");

        console.log(booking);
        res.send(booking);
    } catch (e) {
        return res.status(400).send("No booking of this id exists.");
    }
});

// ===================================== DELETE =====================================
// delete a booking by id
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) return res.status(400).send("No booking of this id exists.");
        console.log(booking);
        res.send(booking);
    } catch (e) {
        return res.status(400).send("No booking of this id exists.");
    }
});

// export router
module.exports = router;