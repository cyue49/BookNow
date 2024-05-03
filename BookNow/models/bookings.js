const mongoose = require('mongoose');
const Joi = require('joi');

// Booking schema
const Booking = mongoose.model('booking', new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId
    }
}));

function validateBooking(booking, operation) {
    // booking
    const client = Joi.string().hex().length(24);
    const provider = Joi.string().hex().length(24);
    const service = Joi.string().hex().length(24);
    const date = Joi.date();
    const address = Joi.string().hex().length(24);
    const payment = Joi.string().hex().length(24);
    const recipient = Joi.string().hex().length(24);

    // ===================================== SCHEMAS =====================================
    // create booking
    const createBookingSchema = Joi.object().keys({
        client: client.required(),
        provider: provider.required(),
        service: service.required(),
        date: date.required(),
        address: address.required(),
        payment: payment.required(),
        recipient: recipient
    });

    // update booking
    const updateBookingSchema = Joi.object().keys({
        client, provider, service, date, address, payment, recipient
    });

    // validate based on operation
    switch (operation) {
        case 'createBooking':
            return createBookingSchema.validate(booking);
        case 'updateBooking':
            return updateBookingSchema.validate(booking);
        default:
            throw new Error("Error: wrong operation");
    }
}

exports.Booking = Booking;
exports.validate = validateBooking;