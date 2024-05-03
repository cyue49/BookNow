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

function validateAvailability(availability) {
    // availability
    const provider = Joi.string().hex().length(24).required();
    const date = Joi.date().required();

    // hourly availability
    const hour = Joi.number().min(0).max(24).required();

    // arrays
    const availableHours = Joi.array().items({ hour}).required();

    const validateAvailabilitySchema = Joi.object().keys({
        provider, date, availableHours
    });

    return validateAvailabilitySchema.validate(availability);
}

exports.Availability = Availability;
exports.validate = validateAvailability;