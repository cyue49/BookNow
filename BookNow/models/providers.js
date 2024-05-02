const mongoose = require('mongoose');
const Joi = require('joi');

// Address schema
const addressSchema = new mongoose.Schema({
    unitNumber: Number,
    streetNumber: {
        type: Number,
        required: true
    },
    streetName: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    province: {
        type: String,
        required: true,
        match: /^[A-Z]{2}$/,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    postalCode: {
        type: String,
        required: true,
        match: /^[A-Z][0-9][A-Z][0-9][A-Z][0-9]$/,
        trim: true
    }
});

// Provider schema
const Provider = mongoose.model('provider', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        lowercase: true,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        match: /^[0-9]{10}$/,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    dateOfBirth: {
        type: Date
    },
    bio: {
        type: String,
        minlength: 1,
        maxlength: 500
    },
    addresses: [addressSchema],
}))

function validateProvider(provider, operation) {
    // user 
    const email = Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const phone = Joi.string().pattern(/^[0-9]{10}$/);
    const firstName = Joi.string();
    const lastName = Joi.string();
    const gender = Joi.string().valid('male', 'female', 'other');
    const dateOfBirth = Joi.date().less('now');
    const bio = Joi.string();

    // address
    const unitNumber = Joi.number();
    const streetNumber = Joi.number().required();
    const streetName = Joi.string().required();
    const city = Joi.string().required();
    const province = Joi.string().pattern(/^[A-Z]{2}$/).required();
    const country = Joi.string().required();
    const postalCode = Joi.string().pattern(/^[A-Z][0-9][A-Z][0-9][A-Z][0-9]$/).required();

    // arrays
    const addresses = Joi.array().items({ unitNumber, streetNumber, streetName, city, province, country, postalCode });

    // create user
    const createUserSchema = Joi.object().keys({
        email: email.required(),
        phone: phone.required(),
        firstName: firstName.required(),
        lastName: lastName.required(),
        gender, dateOfBirth, bio, addresses
    });

    // validate based on operation
    switch (operation) {
        case 'createProvider':
            return createUserSchema.validate(provider);
        default:
            throw new Error("Error: wrong operation");
    }
}

exports.Provider = Provider;
exports.validate = validateProvider;