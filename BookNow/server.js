const mongoose = require('mongoose');
const dbString = require('./config');
const clients = require('./routes/clients');
const providers = require('./routes/providers');
const express = require('express');
const app = express();

// connect to database
const connectionString = dbString.dbString;
mongoose.connect(connectionString)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// routes
// TODO: add routes
app.use('/api/clients', clients);
app.use('/api/providers', providers);

// host and port
const hostname = '127.0.0.1';
const port = 3000;

// listen on port and hostname
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});