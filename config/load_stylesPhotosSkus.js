/* eslint-disable no-await-in-loop, func-names, no-loop-func, no-console */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Client } = require('cassandra-driver');

const client = new Client({
  contactPoints: [process.env.HOSTNAME],
  localDataCenter: process.env.DB_DATACENTER,
  keyspace: process.env.DB_KEYSPACE,
});

const stylesQuery = 'SELECT * FROM product_db.styles_by_product';
const photosQuery =
  'SELECT thumbnail_url, url FROM product_db.photos_by_style WHERE style_id=?';
const skusQuery =
  'SELECT id, quantity, size FROM product_db.skus_by_style WHERE style_id=?';
const writeQuery = `INSERT INTO product_db.styles_with_photos_skus
  (product_id, id, default_style, name, original_price, sale_price, photos, skus)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;
let options = { prepare: true, fetchSize: 1000 };
let savedPage = null;

const getStylesAndStorePage = async () => {
  if (savedPage) options = { ...options, pageState: savedPage };
  const stylesResult = await client.execute(stylesQuery, [], options);
  const { rows: styles } = stylesResult;
  const { pageState } = stylesResult;
  savedPage = pageState;
  return styles;
};

const combineStylesWithPhotos = async (styles) => {
  const promises = [];
  for (let i = 0; i < styles.length; i += 1) {
    promises.push(
      client.execute(photosQuery, [styles[i].id], { prepare: true })
    );
  }
  const results = await Promise.all(promises);
  const photos = results.map(
    (result) => result.rows.map((row) => ({ ...row })) // strip the 'Row' signature
  );
  return styles.map((style, i) => ({
    ...style,
    photos: photos[i],
  }));
};

const combineStylesWithSkus = async (styles) => {
  const promises = [];
  for (let i = 0; i < styles.length; i += 1) {
    promises.push(client.execute(skusQuery, [styles[i].id], { prepare: true }));
  }
  const results = await Promise.all(promises);
  const cleanResults = results.map(
    (result) => result.rows.map((row) => ({ ...row })) // strip the 'Row' signature
  );
  const skus = cleanResults.map((cleanResult) =>
    cleanResult.reduce(
      (acc, obj) => ({
        ...acc,
        [obj.id]: {
          quantity: obj.quantity,
          size: obj.size,
        },
      }),
      {}
    )
  );
  return styles.map((style, i) => ({
    ...style,
    skus: skus[i],
  }));
};

const formatValues = (productWithFeatures) => {
  const result = [];
  result.push(productWithFeatures.product_id);
  result.push(productWithFeatures.id);
  result.push(productWithFeatures.default_style);
  result.push(productWithFeatures.name);
  result.push(productWithFeatures.original_price);
  result.push(productWithFeatures.sale_price);
  result.push(productWithFeatures.photos);
  result.push(productWithFeatures.skus);
  return result;
};

const writeToStylesPhotosSkus = async (stylesPhotosSkus) => {
  const promises = [];
  for (let i = 0; i < stylesPhotosSkus.length; i += 1) {
    const values = formatValues(stylesPhotosSkus[i]);
    promises.push(client.execute(writeQuery, [...values], { prepare: true }));
  }
  return Promise.all(promises);
};

(async () => {
  await client
    .execute('DROP TABLE IF EXISTS product_db.styles_with_photos_skus')
    .then(() => console.log('DROP TABLE'))
    .catch((err) => console.error(err));

  await client
    .execute(`DROP TYPE IF EXISTS product_db.photo;`)
    .then(() => console.log('DROP TYPE product_db.photo'))
    .catch((err) => console.error(err));
  await client
    .execute(
      `CREATE TYPE IF NOT EXISTS product_db.photo (
          thumbnail_url   text,
          url             text
      );`
    )
    .then(() => console.log('CREATE TYPE product_db.photo'))
    .catch((err) => console.error(err));

  await client
    .execute(`DROP TYPE IF EXISTS product_db.sku;`)
    .then(() => console.log('DROP TYPE product_db.sku'))
    .catch((err) => console.error(err));
  await client
    .execute(
      `CREATE TYPE IF NOT EXISTS product_db.sku (
          quantity        int,
          size            text
      );`
    )
    .then(() => console.log('CREATE TYPE product_db.sku'))
    .catch((err) => console.error(err));

  await client
    .execute(
      `CREATE TABLE IF NOT EXISTS product_db.styles_with_photos_skus (
          product_id       int,
          id               int,
          default_style    boolean,
          name             text,
          original_price   int,
          sale_price       int,
          photos           list<frozen<photo>>,
          skus             map<text, frozen<sku>>,
          PRIMARY KEY (product_id, id)
      );`
    )
    .then(() => console.log('CREATE TABLE product_db.styles_with_photos_skus'))
    .catch((err) => console.error(err));
  let i = 0;
  do {
    await getStylesAndStorePage()
      .then(combineStylesWithPhotos)
      .then(combineStylesWithSkus)
      .then(writeToStylesPhotosSkus)
      .then(() => {
        i += 1000;
        console.log(`INSERT ${i} ROWS INTO product_db.styles_with_photos_skus`);
      });
  } while (savedPage);
  console.log('done!');
})();
