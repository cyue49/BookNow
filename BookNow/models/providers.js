const mongoose = require('mongoose');
const Joi = require('joi');

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
    }
}))

function validateProvider(provider, operation) {
    // user 
    const email = Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const phone = Joi.string().pattern(/^[0-9]{10}$/);

    // create user
    const createUserSchema = Joi.object().keys({
        email: email.required(),
        phone: phone.required()
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