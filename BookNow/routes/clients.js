const mongoose = require('mongoose');
const { Client, validate } = require('../models/clients');
const express = require('express');
const router = express.Router();

// GET
router.get('/', async (req, res) => {
    const clients = await Client.find();
    console.log(clients);
    res.send(clients);
})

// Post
router.post('/', async (req, res) => {
    // input validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // create a new client
    const client = new Client({
        email: req.body.email,
        phone: req.body.phone
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

// export router
module.exports = router;