const mongoose = require('mongoose');
const Joi = require('joi');

// Hours schema
const hoursSchema = new mongoose.Schema({
    hour: {
        type: Number,
        required: true,
        min: 0,
        max: 24
    }
});

// Availability schema
const Availability = mongoose.model('availability', new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider',
        required: true
    },
    date: {
        type: Date
    },
    availableHours: [hoursSchema],
}));

function validateAvailability(availability, operation) {
    // availability
    const provider = Joi.string().hex().length(24);
    const date = Joi.date();

    // hourly availability
    const hour = Joi.number().min(0).max(24).required();

    // arrays
    const availableHours = Joi.array().items({ hour });

    // create availability
    const createAvailabilitySchema = Joi.object().keys({
        provider: provider.required(),
        date: date.required(),
        availableHours: availableHours.required()
    });

    // update availability
    const updateAvailabilitySchema = Joi.object().keys({
        provider, date, availableHours
    });

    // update availability hours
    const updateAvailabilityHoursSchema = Joi.object().keys({
        hour
    });

    // validate based on operation
    switch (operation) {
        case 'createAvailability':
            return createAvailabilitySchema.validate(availability);
        case 'updateAvailability':
            return updateAvailabilitySchema.validate(availability);
        case 'updateAvailabilityHour':
            return updateAvailabilityHoursSchema.validate(availability);
        default:
            throw new Error("Error: wrong operation");
    }
}

exports.Availability = Availability;
exports.validate = validateAvailability;