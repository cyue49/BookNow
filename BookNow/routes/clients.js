const mongoose = require('mongoose');
const { Client, validate } = require('../models/clients');
const express = require('express');
const router = express.Router();

// ===================================== GET =====================================
// get all clients
router.get('/', async (req, res) => {
    const clients = await Client.find();
    console.log(clients);
    res.send(clients);
});

// get a specific client by id
router.get('/:id', async (req, res) => {
    const client = await Client.find({ _id: req.params.id });
    console.log(client);
    res.send(client);
});

// get all addresses for a client
router.get('/:id/addresses', async (req, res) => {
    const addresses = await Client.find({ _id: req.params.id }).select('addresses');
    console.log(addresses);
    res.send(addresses);
});

// get all payments for a client
router.get('/:id/payments', async (req, res) => {
    const payments = await Client.find({ _id: req.params.id }).select('payments');
    console.log(payments);
    res.send(payments);
});

// get all recipients for a client
router.get('/:id/recipients', async (req, res) => {
    const recipients = await Client.find({ _id: req.params.id }).select('recipients');
    console.log(recipients);
    res.send(recipients);
});

// ===================================== POST =====================================
// add a new client user
router.post('/', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'createUser');
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
        addresses: req.body.addresses,
        payments: req.body.payments,
        recipients: req.body.recipients
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

// ===================================== PUT =====================================
// update general client info
router.put('/:id', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateUser');
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
                    addresses: req.body.addresses,
                    payments: req.body.payments,
                    recipients: req.body.recipients
                }
            }
        );

        // if no client of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// ------------------------------------- Address -------------------------------------
// update client address
router.put('/:id/addresses/update/:addrID', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateAddress');
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    [`addresses.$[addr].unitNumber`]: req.body.addresses[0].unitNumber,
                    [`addresses.$[addr].streetNumber`]: req.body.addresses[0].streetNumber,
                    [`addresses.$[addr].streetName`]: req.body.addresses[0].streetName,
                    [`addresses.$[addr].city`]: req.body.addresses[0].city,
                    [`addresses.$[addr].province`]: req.body.addresses[0].province,
                    [`addresses.$[addr].country`]: req.body.addresses[0].country,
                    [`addresses.$[addr].postalCode`]: req.body.addresses[0].postalCode
                }
            },
            {
                'arrayFilters': [{ "addr._id": req.params.addrID }]
            }
        );

        // if no client of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// add new client address
router.put('/:id/addresses/add', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateAddress');
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    addresses: req.body.addresses
                }
            }
        );

        // if no client of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// delete a client address
router.put('/:id/addresses/remove/:addrID', async (req, res) => {
    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $pull: {
                    addresses: {_id: req.params.addrID}
                }
            }
        );

        // if no client of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// ------------------------------------- Payment -------------------------------------
// update client payment
router.put('/:id/payments/update/:payID', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updatePayment');
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    [`payments.$[pay].paymentMethod`]: req.body.payments[0].paymentMethod,
                    [`payments.$[pay].cardNumber`]: req.body.payments[0].cardNumber,
                    [`payments.$[pay].expirationDate`]: req.body.payments[0].expirationDate,
                    [`payments.$[pay].cvv`]: req.body.payments[0].cvv
                }
            },
            {
                'arrayFilters': [{ "pay._id": req.params.payID }]
            }
        );

        // if no client of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// add new client payment
router.put('/:id/payments/add', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updatePayment');
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    payments: req.body.payments
                }
            }
        );

        // if no client of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// delete a client payment
router.put('/:id/payments/remove/:payID', async (req, res) => {
    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $pull: {
                    payments: {_id: req.params.payID}
                }
            }
        );

        // if no client of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// ------------------------------------- Recipient -------------------------------------
// update client recipient
router.put('/:id/recipients/update/:recID', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateRecipient');
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    [`recipients.$[rec].firstName`]: req.body.recipients[0].firstName,
                    [`recipients.$[rec].lastName`]: req.body.recipients[0].lastName,
                    [`recipients.$[rec].email`]: req.body.recipients[0].email,
                    [`recipients.$[rec].phone`]: req.body.recipients[0].phone,
                    [`recipients.$[rec].relationship`]: req.body.recipients[0].relationship,
                    [`recipients.$[rec].gender`]: req.body.recipients[0].gender,
                    [`recipients.$[rec].dateOfBirth`]: req.body.recipients[0].dateOfBirth,
                    [`recipients.$[rec].medicalConditions`]: req.body.recipients[0].medicalConditions
                }
            },
            {
                'arrayFilters': [{ "rec._id": req.params.recID }]
            }
        );

        // if no client of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// add new client recipient
router.put('/:id/recipients/add', async (req, res) => {
    // input validation
    const { error } = validate(req.body, 'updateRecipient');
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    recipients: req.body.recipients
                }
            }
        );

        // if no client of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// delete a recipient address
router.put('/:id/recipients/remove/:recID', async (req, res) => {
    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $pull: {
                    recipients: {_id: req.params.recID}
                }
            }
        );

        // if no client of this id
        if (!client) return res.status(400).send("No client of this id exists.");

        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// ===================================== DELETE =====================================
// delete a client user by id
router.delete('/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);

        if (!client) return res.status(400).send("No client of this id exists.");
        console.log(client);
        res.send(client);
    } catch (e) {
        return res.status(400).send("No client of this id exists.");
    }
});

// export router
module.exports = router;