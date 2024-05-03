const mongoose = require('mongoose');
const Joi = require('joi');

// Service schema
const Service = mongoose.model('service', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    }
}));

function validateService(service, operation) {
    // service
    const name = Joi.string();
    const description = Joi.string();
    const price = Joi.number();

    // ===================================== SCHEMAS =====================================
    // create service
    const createServiceSchema = Joi.object().keys({
        name: name.required(),
        description: description.required(),
        price: price.required()
    });

    // update service
    const updateServiceSchema = Joi.object().keys({
        name, description, price
    });

    // validate based on operation
    switch (operation) {
        case 'createService':
            return createServiceSchema.validate(service);
        case 'updateService':
            return updateServiceSchema.validate(service);
        default:
            throw new Error("Error: wrong operation");
    }
}

exports.Service = Service;
exports.validate = validateService;