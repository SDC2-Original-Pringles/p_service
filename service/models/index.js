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

  readStylesByPid(product_id) {
    return client.execute(`SELECT * FROM styles_by_product WHERE product_id=${product_id}`)
      .then(({ rows }) => rows)
      .catch((err) => console.error(err));
  },

  readRelatedProducts(current_pid) {
    return client.execute(`SELECT related_pid FROM related_by_current WHERE current_pid=${current_pid}`)
      .then(({ rows }) => rows.map((row) => row.related_pid))
      .catch((err) => console.error(err));
  },
};
