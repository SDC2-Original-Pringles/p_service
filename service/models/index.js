const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: [process.env.HOSTNAME],
  localDataCenter: process.env.DB_DATACENTER,
  keyspace: process.env.DB_KEYSPACE,
});

module.exports = {
  readProductList(page = 1, count = 5) {
    return client.execute(`SELECT * FROM products LIMIT ${page * count}`)
      .then(({ rows }) => rows.slice((page * count) - count))
      .catch((err) => console.error(err));
  },

  readProductById(id) {
    return client.execute(`SELECT * FROM products WHERE id=${id}`)
      .then(({ rows }) => rows)
      .catch((err) => console.error(err));
  },
};
