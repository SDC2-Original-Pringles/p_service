require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const router = require('./routes');

const { HOSTNAME, PORT } = process.env;

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// FILL YOUR ROUTE
app.use('/', router);

app.listen(PORT);
// eslint-disable-next-line
console.log(`Server listening at http://${HOSTNAME}:${PORT}`);
