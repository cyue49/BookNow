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

// get all providers including service info
router.get('/showService', async (req, res) => {
    const providers = await Provider.find().populate('service');
    console.log(providers);
    res.send(providers);
});

// get a specific provider by id
router.get('/:id', async (req, res) => {
    const provider = await Provider.find({ _id: req.params.id });
    console.log(provider);
    res.send(provider);
});

// get a specific provider by id including service info
router.get('/showService/:id', async (req, res) => {
    const provider = await Provider.find({ _id: req.params.id }).populate('service');
    console.log(provider);
    res.send(provider);
});

// get all addresses for a provider
router.get('/:id/addresses', async (req, res) => {
    const addresses = await Provider.find({ _id: req.params.id }).select('addresses');
    console.log(addresses);
    res.send(addresses);
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
        service: req.body.service,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        bio: req.body.bio,
        addresses: req.body.addresses
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

// ===================================== PUT =====================================
// update general provider info
router.put('/:id', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateProvider');
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find user to update
        const provider = await Provider.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    email: req.body.email,
                    phone: req.body.phone,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    service: req.body.service,
                    gender: req.body.gender,
                    dateOfBirth: req.body.dateOfBirth,
                    bio: req.body.bio,
                    addresses: req.body.addresses
                }
            }
        );

        // if no provider of this id
        if (!provider) return res.status(400).send("No provider of this id exists.");

        console.log(provider);
        res.send(provider);
    } catch (e) {
        return res.status(400).send("No provider of this id exists.");
    }
});

// ------------------------------------- Address -------------------------------------
// update provider address
router.put('/:id/addresses/update/:addrID', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateAddress');
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find user to update
        const provider = await Provider.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    [`addresses.$[addr].unitNumber`]: req.body.unitNumber,
                    [`addresses.$[addr].streetNumber`]: req.body.streetNumber,
                    [`addresses.$[addr].streetName`]: req.body.streetName,
                    [`addresses.$[addr].city`]: req.body.city,
                    [`addresses.$[addr].province`]: req.body.province,
                    [`addresses.$[addr].country`]: req.body.country,
                    [`addresses.$[addr].postalCode`]: req.body.postalCode
                }
            },
            {
                'arrayFilters': [{ "addr._id": req.params.addrID }]
            }
        );

        // if no provider of this id
        if (!provider) return res.status(400).send("No provider of this id exists.");

        console.log(provider);
        res.send(provider);
    } catch (e) {
        return res.status(400).send("No provider of this id exists.");
    }
});

// add new provider address
router.put('/:id/addresses/add', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateAddress');
    if (error) return res.status(400).send(error.details[0].message);

    // create a new address
    const address = {
        unitNumber: parseInt(req.body.unitNumber),
        streetNumber: parseInt(req.body.streetNumber),
        streetName: req.body.streetName,
        city: req.body.city,
        province: req.body.province,
        country: req.body.country,
        postalCode: req.body.postalCode,
    };

    try {
        // find user to update
        const provider = await Provider.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    addresses: address
                }
            }
        );

        // if no provider of this id
        if (!provider) return res.status(400).send("No provider of this id exists.");

        console.log(provider);
        res.send(provider);
    } catch (e) {
        return res.status(400).send("No provider of this id exists.");
    }
});

// delete a provider address
router.put('/:id/addresses/remove/:addrID', async (req, res) => {
    try {
        // find user to update
        const provider = await Provider.findByIdAndUpdate(req.params.id,
            {
                $pull: {
                    addresses: {_id: req.params.addrID}
                }
            }
        );

        // if no provider of this id
        if (!provider) return res.status(400).send("No provider of this id exists.");

        console.log(provider);
        res.send(provider);
    } catch (e) {
        return res.status(400).send("No provider of this id exists.");
    }
});

// ===================================== DELETE =====================================
// delete a provider user by id
router.delete('/:id', async (req, res) => {
    try {
        const provider = await Provider.findByIdAndDelete(req.params.id);

        if (!provider) return res.status(400).send("No provider of this id exists.");
        console.log(provider);
        res.send(provider);
    } catch (e) {
        return res.status(400).send("No provider of this id exists.");
    }
});

// export router
module.exports = router;