const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const csv = require('csv-parser');
const fs = require('fs');

const {
  PHOTOS_PATH,
  // TEST_PATH,
  // PRODUCT_PATH, STYLES_PATH, FEATURES_PATH, RELATED_PATH, SKUS_PATH, CART_PATH,
} = process.env;

const readStream = fs.createReadStream(PHOTOS_PATH);
const writeStream = fs.createWriteStream(
  path.join(PHOTOS_PATH, '../../clean/photos.csv'),
);
// const readStream = fs.createReadStream(TEST_PATH);
// const writeStream = fs.createWriteStream(path.join(TEST_PATH, '../../clean/test.csv'));

writeStream.write('id,style_id,url,thumbnail_url\n');
readStream.pipe(csv({ quote: "'" })).on('data', async (chunk) => {
  const copy = { ...chunk };
  copy.id = copy.id.replaceAll(/\D/g, '');
  copy.styleId = copy.styleId.replaceAll(/\D/g, '');
  copy.url = copy.url.replaceAll(/"|\\/g, '');
  copy.thumbnail_url = copy.thumbnail_url.replaceAll(/"|\\/g, '');
  copy.url = `"${copy.url}"`;
  copy.thumbnail_url = `"${copy.thumbnail_url}"`;
  writeStream.write(
    `${copy.id},${copy.styleId},${copy.url},${copy.thumbnail_url}\n`,
  );
});
