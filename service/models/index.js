const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: [process.env.HOSTNAME],
  localDataCenter: process.env.DB_DATACENTER,
  keyspace: process.env.DB_KEYSPACE,
});

module.exports = {
  readProductList(page = 1, count = 5) {
    return client.execute(`SELECT * FROM products LIMIT ${page * count}`)
      .then(({ rows }) => rows.slice((page * count) - count));
  },

  readProductById(id) {
    return Promise.all([
      client.execute(`SELECT * FROM products WHERE id=${id}`),
      client.execute(`SELECT * FROM features_by_product WHERE product_id=${id}`),
    ])
      .then(([{ rows: [product] }, { rows: features }]) => ({
        ...product,
        features: features.map((feature) => ({ feature: feature.feature, value: feature.value })),
      }));
  },

  readStylesByPid(product_id) {
    return client.execute(`SELECT * FROM styles_by_product WHERE product_id=${product_id}`)
      .then(({ rows: styles }) => (Promise.all(
        styles.map(async (style) => {
          const [{ rows: photoRows }, { rows: skuRows }] = await Promise.all([
            client.execute(`SELECT * FROM photos_by_style WHERE style_id=${style.id}`),
            client.execute(`SELECT * FROM skus_by_style WHERE style_id=${style.id}`),
          ]);
          const photos = photoRows.map(({ thumbnail_url, url }) => ({ thumbnail_url, url }));
          const skus = skuRows.reduce((acc, skuRow) => ({
            ...acc,
            [skuRow.id]: {
              quantity: skuRow.quantity,
              size: skuRow.size,
            },
          }), {});
          if (!photos.length) photos = [{ thumbnail_url: null, url: null }];
          if (!Object.keys(skus).length) skus = { null: { quantity: null, size: null } };
          return {
            style_id: style.id,
            name: style.name,
            original_price: style.original_price,
            sale_price: style.sale_price,
            'default?': style.default_style,
            photos,
            skus,
          };
        }),
      )));
  },

  readRelatedProducts(current_pid) {
    return client.execute(`SELECT related_pid FROM related_by_current WHERE current_pid=${current_pid}`)
      .then(({ rows }) => rows.map((row) => row.related_pid));
  },
};
