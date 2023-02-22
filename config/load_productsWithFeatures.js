/* eslint-disable no-await-in-loop, func-names, no-loop-func, no-console */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Client } = require('cassandra-driver');

const client = new Client({
  contactPoints: [process.env.HOSTNAME],
  localDataCenter: process.env.DB_DATACENTER,
  keyspace: process.env.DB_KEYSPACE,
});

const productsQuery = 'SELECT * FROM products';
const featuresQuery =
  'SELECT feature, value FROM features_by_product WHERE product_id=?';
const writeQuery = `INSERT INTO products_with_features
  (id, name, slogan, description, category, default_price, features)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;
let options = { prepare: true, fetchSize: 1000 };
let savedPage = null;

const getProductsAndStorePage = async () => {
  if (savedPage) options = { ...options, pageState: savedPage };
  const productResult = await client.execute(productsQuery, [], options);
  const { rows: products } = productResult;
  const { pageState } = productResult;
  savedPage = pageState;
  return products;
};

const combineProductsWithFeatures = async (products) => {
  const promises = [];
  for (let i = 0; i < products.length; i += 1) {
    promises.push(
      client.execute(featuresQuery, [products[i].id], { prepare: true })
    );
  }
  const results = await Promise.all(promises);
  const features = results.map(
    (result) => result.rows.map((row) => ({ ...row })) // strip the 'Row' signature
  );
  return products.map((product, i) => ({
    ...product,
    features: features[i],
  }));
};

const formatValues = (productWithFeatures) => {
  const result = [];
  result.push(productWithFeatures.id);
  result.push(productWithFeatures.name);
  result.push(productWithFeatures.slogan);
  result.push(productWithFeatures.description);
  result.push(productWithFeatures.category);
  result.push(productWithFeatures.default_price);
  result.push(productWithFeatures.features);
  return result;
};

const writeToProductsWithFeatures = async (productsWithFeatures) => {
  const promises = [];
  for (let i = 0; i < productsWithFeatures.length; i += 1) {
    const values = formatValues(productsWithFeatures[i]);
    promises.push(client.execute(writeQuery, [...values], { prepare: true }));
  }
  return Promise.all(promises);
};

(async () => {
  await client
    .execute('DROP TABLE IF EXISTS products_with_features;')
    .then(() => console.log('DROP TABLE'))
    .catch((err) => console.error(err));
  await client
    .execute(`DROP TYPE IF EXISTS product_db.feature;`)
    .then(() => console.log('DROP TYPE'))
    .catch((err) => console.error(err));
  await client.execute(
    `CREATE TYPE IF NOT EXISTS feature (
        feature         text,
        value           text,
    )`
  );
  await client
    .execute(
      `CREATE TABLE IF NOT EXISTS products_with_features (
          id              int PRIMARY KEY,
          name            text,
          slogan          text,
          description     text,
          category        text,
          default_price   int,
          features        list<frozen<feature>>
      );`
    )
    .then(() => console.log('CREATE TABLE'))
    .catch((err) => console.error(err));
  let i = 0;
  do {
    await getProductsAndStorePage()
      .then(combineProductsWithFeatures)
      .then(writeToProductsWithFeatures)
      .then(() => {
        i += 1000;
        console.log(`INSERT ${i} ROWS INTO products_with_features`);
      });
  } while (savedPage);
  console.log('done!');
})();
