const mongoose = require('mongoose');
const { Provider, validate } = require('../models/providers');
const express = require('express');
const router = express.Router();

// ===================================== GET =====================================
// get all providers
router.get('/', async (req, res) => {
    const providers = await Provider.find();
    console.log(providers);
    res.send(providers);
});

// ===================================== POST =====================================
// add a new provider user
router.post('/', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'createProvider');
    if (error) return res.status(400).send(error.details[0].message);

    // create a new provider
    const provider = new Provider({
        email: req.body.email,
        phone: req.body.phone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        bio: req.body.bio,
        addresses: req.body.addresses,
    });

    try {
        const result = await provider.save();
        console.log(result);
        res.send(result);
    } catch (ex) {
        console.log(ex.message);
        res.status(400).send(ex.message);
    }
});

// export router
module.exports = router;