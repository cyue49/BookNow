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
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true,
        match: /^[A-Z]{2}$/,
    },
    country: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true,
        match: /^[A-Z][0-9][A-Z][0-9][A-Z][0-9]$/,
    }
});

// Client schema
const Client = mongoose.model('client', new mongoose.Schema({
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
        trim: true,
        unique: true
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
    medicalConditions: {
        type: String,
        maxlength: 500,
        trim: true
    },
    address: [addressSchema]
}))

// validate function for POST
function validateClientAdd(client){
    const schema = Joi.object({
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
        phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        gender: Joi.string(),
        dateOfBirth: Joi.date().less('now'),
        medicalConditions: Joi.string(),
        address: Joi.array().items({
            unitNumber: Joi.number(),
            streetNumber: Joi.number().required(),
            streetName: Joi.string().required(),
            city: Joi.string().required(),
            province: Joi.string().pattern(/^[A-Z]{2}$/).required(),
            country: Joi.string().required(),
            postalCode: Joi.string().pattern(/^[A-Z][0-9][A-Z][0-9][A-Z][0-9]$/).required()
        })
    });

    return schema.validate(client);
}

// validate function for PUT
function validateClientUpdate(client){
    const schema = Joi.object({
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        phone: Joi.string().pattern(/^[0-9]{10}$/),
        firstName: Joi.string(),
        lastName: Joi.string(),
        gender: Joi.string(),
        dateOfBirth: Joi.date().less('now'),
        medicalConditions: Joi.string(),
        address: Joi.array().items({
            unitNumber: Joi.number(),
            streetNumber: Joi.number().required(),
            streetName: Joi.string().required(),
            city: Joi.string().required(),
            province: Joi.string().pattern(/^[A-Z]{2}$/).required(),
            country: Joi.string().required(),
            postalCode: Joi.string().pattern(/^[A-Z][0-9][A-Z][0-9][A-Z][0-9]$/).required()
        })
    });

    return schema.validate(client);
}

// validate function for PUT new address
function validateClientUpdateNewAddress(client){
    const schema = Joi.object({
        address: Joi.array().items({
            unitNumber: Joi.number(),
            streetNumber: Joi.number().required(),
            streetName: Joi.string().required(),
            city: Joi.string().required(),
            province: Joi.string().pattern(/^[A-Z]{2}$/).required(),
            country: Joi.string().required(),
            postalCode: Joi.string().pattern(/^[A-Z][0-9][A-Z][0-9][A-Z][0-9]$/).required()
        }).required()
    });

    return schema.validate(client);
}

exports.Client = Client;
exports.validateAdd = validateClientAdd;
exports.validateUpdate = validateClientUpdate;
exports.validateUpdateNewAddress = validateClientUpdateNewAddress;