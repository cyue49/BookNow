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

// get a specific address for a client
router.get('/:id/addresses/:addrID', async (req, res) => {
    const address = await Client.find({
        _id: req.params.id
    },
    {
        addresses: {
            "$elemMatch": {
                "_id": req.params.addrID
            }
        }
    }
);
    console.log(address);
    res.send(address);
});

// get all payments for a client
router.get('/:id/payments', async (req, res) => {
    const payments = await Client.find({ _id: req.params.id }).select('payments');
    console.log(payments);
    res.send(payments);
});

// get a specific payment for a client
router.get('/:id/payments/:payID', async (req, res) => {
    const payment = await Client.find({
        _id: req.params.id
    },
    {
        payments: {
            "$elemMatch": {
                "_id": req.params.payID
            }
        }
    }
);
    console.log(payment);
    res.send(payment);
});

// get all recipients for a client
router.get('/:id/recipients', async (req, res) => {
    const recipients = await Client.find({ _id: req.params.id }).select('recipients');
    console.log(recipients);
    res.send(recipients);
});

// get a specific recipient for a client
router.get('/:id/recipients/:recID', async (req, res) => {
    const recipient = await Client.find({
        _id: req.params.id
    },
    {
        recipients: {
            "$elemMatch": {
                "_id": req.params.recID
            }
        }
    }
);
    console.log(recipient);
    res.send(recipient);
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
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    addresses: address
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
                    [`payments.$[pay].paymentMethod`]: req.body.paymentMethod,
                    [`payments.$[pay].cardNumber`]: req.body.cardNumber,
                    [`payments.$[pay].expirationDate`]: req.body.expirationDate,
                    [`payments.$[pay].cvv`]: req.body.cvv
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

    // create a new payment
    const payment = {
        paymentMethod: req.body.paymentMethod,
        cardNumber: req.body.cardNumber,
        expirationDate: req.body.expirationDate,
        cvv: req.body.cvv
    };

    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    payments: payment
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
                    [`recipients.$[rec].firstName`]: req.body.firstName,
                    [`recipients.$[rec].lastName`]: req.body.lastName,
                    [`recipients.$[rec].email`]: req.body.email,
                    [`recipients.$[rec].phone`]: req.body.phone,
                    [`recipients.$[rec].relationship`]: req.body.relationship,
                    [`recipients.$[rec].gender`]: req.body.gender,
                    [`recipients.$[rec].dateOfBirth`]: req.body.dateOfBirth,
                    [`recipients.$[rec].medicalConditions`]: req.body.medicalConditions
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

    // create a new recipient
    const recipient = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        relationship: req.body.relationship,
        gender: req.body.dateOfBirth,
        dateOfBirth: req.body.dateOfBirth,
        medicalConditions: req.body.medicalConditions
    };

    try {
        // find user to update
        const client = await Client.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    recipients: recipient
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