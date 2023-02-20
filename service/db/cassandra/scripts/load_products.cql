DROP TABLE IF EXISTS product_db.products;

CREATE TABLE IF NOT EXISTS products (
  id              int PRIMARY KEY,
  name            text,
  slogan          text,
  description     text,
  category        text,
  default_price   int
);

COPY products (id, name, slogan, description, category, default_price)
FROM '/home/blin/project-sdc/p_service/files/raw/product.csv'
WITH HEADER = TRUE;