DROP TABLE IF EXISTS product_db.products;
DROP TABLE IF EXISTS product_db.styles;
DROP TABLE IF EXISTS product_db.photos;
DROP TABLE IF EXISTS product_db.skus;
DROP TABLE IF EXISTS product_db.related;
DROP TABLE IF EXISTS product_db.features;
DROP TABLE IF EXISTS product_db.cart;

CREATE TABLE IF NOT EXISTS products (
  id              int PRIMARY KEY,
  name            text,
  slogan          text,
  description     text,
  category        text,
  default_price   int
);

COPY products (id, name, slogan, description, category, default_price)
FROM '/home/blin/project-sdc/p_service/files/product.csv'
WITH HEADER = TRUE;

CREATE TABLE IF NOT EXISTS styles (
  id              int PRIMARY KEY,
  product_id      int,
  name            text,
  sale_price      int,
  original_price  int,
  default_style   boolean
);

COPY styles (id, product_id, name, sale_price, original_price, default_style)
FROM '/home/blin/project-sdc/p_service/files/styles.csv'
WITH HEADER = TRUE AND NULL = 'null';

CREATE TABLE IF NOT EXISTS photos (
  id              int PRIMARY KEY,
  style_id        int,
  url             text,
  thumbnail_url   text
);

COPY photos (id, style_id, url, thumbnail_url)
FROM '/home/blin/project-sdc/p_service/files/photos.csv'
WITH HEADER = TRUE;

CREATE TABLE IF NOT EXISTS skus (
  id              int PRIMARY KEY,
  style_id        int,
  size            text,
  quantity        int
);

COPY skus (id, style_id, size, quantity)
FROM '/home/blin/project-sdc/p_service/files/skus.csv'
WITH HEADER = TRUE;

CREATE TABLE IF NOT EXISTS related (
  id              int PRIMARY KEY,
  product1_id     int,
  product2_id     int
);

COPY related (id, product1_id, product2_id)
FROM '/home/blin/project-sdc/p_service/files/related.csv'
WITH HEADER = TRUE; NULL = '0';

CREATE TABLE IF NOT EXISTS features (
  id              int PRIMARY KEY,
  product_id      int,
  feature         text,
  value           text
);

COPY features (id, product_id, feature, value)
FROM '/home/blin/project-sdc/p_service/files/features.csv'
WITH HEADER = TRUE AND NULL = 'null';

CREATE TABLE IF NOT EXISTS cart (
  id              smallint PRIMARY KEY,
  user_session    smallint,
  product_id      int,
  active          boolean
);

COPY cart (id, user_session, product_id, active)
FROM '/home/blin/project-sdc/p_service/files/cart.csv'
WITH HEADER = TRUE;
