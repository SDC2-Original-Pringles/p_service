require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const router = require('./routes');

const { HOSTNAME, PORT } = process.env;

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/loaderio-5ee06de27d37be9376fbd234d5191dfa', (req, res) =>
  res.sendFile(path.join(__dirname, './loaderio')),
);
app.use('/', router);

app.listen(PORT);
// eslint-disable-next-line
console.log(`Server listening at http://${HOSTNAME}:${PORT}`);
