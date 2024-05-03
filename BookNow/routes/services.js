const mongoose = require('mongoose');
const { Service, validate } = require('../models/services');
const express = require('express');
const router = express.Router();

// ===================================== GET =====================================
// get all services
router.get('/', async (req, res) => {
    const services = await Service.find();
    console.log(services);
    res.send(services);
});

// ===================================== POST =====================================
// add a new service
router.post('/', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'createService');
    if (error) return res.status(400).send(error.details[0].message);

    // create a new service
    const service = new Service({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });

    try {
        const result = await service.save();
        console.log(result);
        res.send(result);
    } catch (ex) {
        console.log(ex.message);
        res.status(400).send(ex.message);
    }
});

// export router
module.exports = router;