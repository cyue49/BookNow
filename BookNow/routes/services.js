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

// get a specific service by id
router.get('/:id', async (req, res) => {
    const service = await Service.find({ _id: req.params.id });
    console.log(service);
    res.send(service);
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

// ===================================== PUT =====================================
// update service info
router.put('/:id', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateService');
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find service to update
        const service = await Service.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price
                }
            }
        );

        // if no service of this id
        if (!service) return res.status(400).send("No service of this id exists.");

        console.log(service);
        res.send(service);
    } catch (e) {
        return res.status(400).send("No service of this id exists.");
    }
});

// ===================================== DELETE =====================================
// delete a service by id
router.delete('/:id', async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) return res.status(400).send("No service of this id exists.");
        console.log(service);
        res.send(service);
    } catch (e) {
        return res.status(400).send("No service of this id exists.");
    }
});
// export router
module.exports = router;