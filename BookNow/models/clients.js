const mongoose = require('mongoose');
const Joi = require('joi');

// create client model
const Client = mongoose.model('client', new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
}))

// validate function
function validateClient(client){
    const schema = Joi.object({
        email: Joi.string().required(),
        phone: Joi.string().required()
    });

    return schema.validate(client);
}

exports.Client = Client;
exports.validate = validateClient;