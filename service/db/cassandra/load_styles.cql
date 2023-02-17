DROP TABLE IF EXISTS product_db.styles_by_product;

CREATE TABLE IF NOT EXISTS styles_by_product (
  id              int,
  product_id      int,
  name            text,
  sale_price      int,
  original_price  int,
  default_style   boolean,
  PRIMARY KEY ((product_id), id)
) WITH CLUSTERING ORDER BY (id ASC);

COPY styles_by_product (id, product_id, name, sale_price, original_price, default_style)
FROM '/home/blin/project-sdc/p_service/files/raw/styles.csv'
WITH HEADER = TRUE AND NULL = 'null' AND BOOLSTYLE = '1,0';