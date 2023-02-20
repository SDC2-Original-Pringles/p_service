const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const { Client } = require('cassandra-driver');

const client = new Client({
  contactPoints: [process.env.HOSTNAME],
  localDataCenter: process.env.DB_DATACENTER,
  keyspace: process.env.DB_KEYSPACE,
});

// client.execute('SELECT * FROM products')
//   .then(({ rows }) => console.log(rows.length));
