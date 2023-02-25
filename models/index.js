const { Client } = require("cassandra-driver");

const client = new Client(
  process.env.ENVIRONMENT === "local"
    ? {
        contactPoints: [process.env.HOSTNAME],
        localDataCenter: process.env.DB_DATACENTER,
        keyspace: process.env.DB_KEYSPACE,
      }
    : {
        cloud: {
          secureConnectBundle: process.env.BUNDLE_PATH,
        },
        credentials: {
          username: process.env.CLIENT_ID,
          password: process.env.CLIENT_SECRET,
        },
        keyspace: process.env.DB_KEYSPACE,
      },
);

client
  .connect()
  .then(() =>
    client.connected
      ? console.log(
          `Connected to ${client.options.localDataCenter}, using ${client.keyspace}.`,
        )
      : console.log(`ERROR: Not connected!`),
  )
  .catch((err) => console.error(err));

module.exports = {
  readProductList(page = 1, count = 5) {
    return client
      .execute(`SELECT * FROM products LIMIT ${page * count}`)
      .then(({ rows: products }) =>
        products.slice(page * count - count).map((product) => ({
          ...product,
          default_price: product.default_price.toString().concat(".00"),
        })),
      );
  },

  readProductById(id) {
    return Promise.all([
      client.execute(`SELECT * FROM products WHERE id=${id}`),
      client.execute(
        `SELECT feature, value FROM features_by_product WHERE product_id=${id}`,
      ),
    ]).then(
      ([
        {
          rows: [product],
        },
        { rows: features },
      ]) => ({
        ...product,
        default_price: product.default_price.toString().concat(".00"),
        features,
      }),
    );
  },

  readProductByIdNew(id) {
    return client
      .execute(`SELECT * FROM products_with_features WHERE id=${id}`)
      .then(({ rows: [product] }) => ({
        ...product,
        default_price: product.default_price.toString().concat(".00"),
      }));
  },

  readStylesByPid(product_id) {
    return client
      .execute(`SELECT * FROM styles_by_product WHERE product_id=${product_id}`)
      .then(({ rows: styles }) =>
        Promise.all(
          styles.map(async (style) => {
            // eslint-disable-next-line prefer-const
            let [{ rows: photos }, { rows: skuRows }] = await Promise.all([
              client.execute(
                `SELECT thumbnail_url, url FROM photos_by_style WHERE style_id=${style.id}`,
              ),
              client.execute(
                `SELECT * FROM skus_by_style WHERE style_id=${style.id}`,
              ),
            ]);
            let skus = skuRows.reduce(
              (acc, skuRow) => ({
                ...acc,
                [skuRow.id]: {
                  quantity: skuRow.quantity,
                  size: skuRow.size,
                },
              }),
              {},
            );
            if (!photos.length) photos = [{ thumbnail_url: null, url: null }];
            if (!Object.keys(skus).length)
              skus = { null: { quantity: null, size: null } };
            return {
              style_id: style.id,
              name: style.name,
              original_price: style.original_price.toString(),
              sale_price: style.sale_price,
              "default?": style.default_style,
              photos,
              skus,
            };
          }),
        ),
      );
  },

  readRelatedProducts(current_pid) {
    return client
      .execute(
        `SELECT related_pid FROM related_by_current WHERE current_pid=${current_pid}`,
      )
      .then(({ rows }) => rows.map((row) => row.related_pid));
  },
};
