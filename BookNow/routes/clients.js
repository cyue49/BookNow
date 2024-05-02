const mongoose = require('mongoose');
const { Client, validateAdd, validateUpdate } = require('../models/clients');
const express = require('express');
const router = express.Router();

// GET
router.get('/', async (req, res) => {
    const clients = await Client.find();
    console.log(clients);
    res.send(clients);
})

// POST
router.post('/', async (req, res) => {
    // input validation
    const { error } = validateAdd(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // create a new client
    const client = new Client({
        email: req.body.email,
        phone: req.body.phone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        medicalConditions: req.body.medicalConditions,
        address: req.body.address
    });

    try {
        const result = await client.save();
        console.log(result);
        res.send(result);
    } catch (ex) {
        console.log(ex.message);
        res.status(400).send(ex.message);
    }
});

// PUT
// update client info general
router.put('/:id', async (req, res) => {
    // input validation
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    email: req.body.email,
                    phone: req.body.phone,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    gender: req.body.gender,
                    dateOfBirth: req.body.dateOfBirth,
                    medicalConditions: req.body.medicalConditions,
                    address: req.body.address
                }
            }
        );

        // if no course of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// update client address
router.put('/:id/addresses/:addrID', async (req, res) => {
    // input validation
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    [`address.$[addr].unitNumber`]: req.body.address[0].unitNumber,
                    [`address.$[addr].streetNumber`]: req.body.address[0].streetNumber,
                    [`address.$[addr].streetName`]: req.body.address[0].streetName,
                    [`address.$[addr].city`]: req.body.address[0].city,
                    [`address.$[addr].province`]: req.body.address[0].province,
                    [`address.$[addr].country`]: req.body.address[0].country,
                    [`address.$[addr].postalCode`]: req.body.address[0].postalCode
                }
            },
            {
                'arrayFilters': [{"addr._id": req.params.addrID}]
            }
        );

        // if no course of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// export router
module.exports = router;