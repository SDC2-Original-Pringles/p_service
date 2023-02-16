const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
client.connect();

client.query('SELECT NOW() as now')
  .then(({ rows }) => console.log(rows))
  .catch((err) => console.log(err));
