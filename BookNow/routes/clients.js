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
    const addresses = await Client.find({ _id: req.params.id }).select('address');
    console.log(addresses);
    res.send(addresses);
});

// get all payments for a client
router.get('/:id/payments', async (req, res) => {
    const payments = await Client.find({ _id: req.params.id }).select('payment');
    console.log(payments);
    res.send(payments);
});

// get all recipients for a client
router.get('/:id/recipients', async (req, res) => {
    const recipients = await Client.find({ _id: req.params.id }).select('recipient');
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
        address: req.body.address,
        payment: req.body.payment,
        recipient: req.body.recipient
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
                    address: req.body.address,
                    payment: req.body.payment,
                    recipient: req.body.recipient
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
                    address: req.body.address
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
                    address: {_id: req.params.addrID}
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
                    [`payment.$[pay].paymentMethod`]: req.body.payment[0].paymentMethod,
                    [`payment.$[pay].cardNumber`]: req.body.payment[0].cardNumber,
                    [`payment.$[pay].expirationDate`]: req.body.payment[0].expirationDate,
                    [`payment.$[pay].cvv`]: req.body.payment[0].cvv
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
                    payment: req.body.payment
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
                    payment: {_id: req.params.payID}
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
                    [`recipient.$[rec].firstName`]: req.body.recipient[0].firstName,
                    [`recipient.$[rec].lastName`]: req.body.recipient[0].lastName,
                    [`recipient.$[rec].email`]: req.body.recipient[0].email,
                    [`recipient.$[rec].phone`]: req.body.recipient[0].phone,
                    [`recipient.$[rec].relationship`]: req.body.recipient[0].relationship,
                    [`recipient.$[rec].gender`]: req.body.recipient[0].gender,
                    [`recipient.$[rec].dateOfBirth`]: req.body.recipient[0].dateOfBirth,
                    [`recipient.$[rec].medicalConditions`]: req.body.recipient[0].medicalConditions
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
                    recipient: req.body.recipient
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
                    recipient: {_id: req.params.recID}
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