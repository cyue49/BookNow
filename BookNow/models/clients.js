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

// Payment schema
const paymentSchema = new mongoose.Schema({
    paymentMethod: {
        type: String,
        required: true,
        enum: ['visa', 'mastercard'],
        trim: true
    },
    cardNumber: {
        type: String,
        required: true,
        match: /^[0-9]{16}$/
    },
    expirationDate: {
        type: Date,
        required: true
    },
    cvv: {
        type: String,
        required: true,
        match: /^[0-9]{3,4}$/,
        trim: true
    }
});

// Recipient schema
const recipientSchema = new mongoose.Schema({
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
    email: {
        type: String,
        minlength: 1,
        maxlength: 50,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        match: /^[0-9]{10}$/,
        trim: true
    },
    relationship: {
        type: String,
        required: true,
        enum: ['family', 'friend', 'other'],
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
    medicalConditions: {
        type: String,
        maxlength: 500,
        trim: true
    },
    address: [addressSchema],
    payment: [paymentSchema],
    recipient: [recipientSchema]
}))

function validateClient(client, operation) {
    // user 
    const email = Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const phone = Joi.string().pattern(/^[0-9]{10}$/);
    const firstName = Joi.string();
    const lastName = Joi.string();
    const gender = Joi.string().valid('male', 'female', 'other');
    const dateOfBirth = Joi.date().less('now');
    const medicalConditions = Joi.string();

    // address
    const unitNumber = Joi.number();
    const streetNumber = Joi.number().required();
    const streetName = Joi.string().required();
    const city = Joi.string().required();
    const province = Joi.string().pattern(/^[A-Z]{2}$/).required();
    const country = Joi.string().required();
    const postalCode = Joi.string().pattern(/^[A-Z][0-9][A-Z][0-9][A-Z][0-9]$/).required();

    // payment
    const paymentMethod = Joi.string().valid('visa', 'mastercard').required();
    const cardNumber = Joi.string().pattern(/^[0-9]{16}$/).required();
    const expirationDate = Joi.date().required();
    const cvv = Joi.string().pattern(/^[0-9]{3,4}$/).required();

    // recipient
    const recFirstName = Joi.string().required();
    const recLastName = Joi.string().required();
    const recEmail = Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const recPhone = Joi.string().pattern(/^[0-9]{10}$/);
    const recRelationship = Joi.string().valid('family', 'friend', 'other').required();
    const recGender = Joi.string().valid('male', 'female', 'other');
    const recDateOfBirth = Joi.date().less('now');
    const recMedicalConditions = Joi.string();

    // arrays
    const address = Joi.array().items({ unitNumber, streetNumber, streetName, city, province, country, postalCode });
    const payment = Joi.array().items({ paymentMethod, cardNumber, expirationDate, cvv });
    const recipient = Joi.array().items({
        firstName: recFirstName,
        lastName: recLastName,
        email: recEmail,
        phone: recPhone,
        relationship: recRelationship,
        gender: recGender,
        dateOfBirth: recDateOfBirth,
        medicalConditions: recMedicalConditions
    });

    // create user
    const createUserSchema = Joi.object().keys({
        email: email.required(),
        phone: phone.required(),
        firstName: firstName.required(),
        lastName: lastName.required(),
        gender, dateOfBirth, medicalConditions, address, payment, recipient
    });

    // update user
    const updateUserSchema = Joi.object().keys({
        email, phone, firstName, lastName, gender, dateOfBirth, medicalConditions, address, payment, recipient
    });

    // update address
    const updateAddressSchema = Joi.object().keys({
        address: address.required()
    });

    // update payment
    const updatePaymentSchema = Joi.object().keys({
        payment: payment.required()
    });

    // update recipient
    const updateRecipientSchema = Joi.object().keys({
        recipient: recipient.required()
    });

    // validate based on operation
    switch (operation) {
        case 'createUser':
            return createUserSchema.validate(client);
        case 'updateUser':
            return updateUserSchema.validate(client);
        case 'updateAddress':
            return updateAddressSchema.validate(client);
        case 'updatePayment':
            return updatePaymentSchema.validate(client);
        case 'updateRecipient':
            return updateRecipientSchema.validate(client);
        default:
            throw new Error("Error: wrong operation");
    }
}

exports.Client = Client;
exports.validate = validateClient;