DROP TABLE IF EXISTS product_db.features_by_product;

CREATE TABLE IF NOT EXISTS features_by_product (
  id              int,
  product_id      int,
  feature         text,
  value           text,
  PRIMARY KEY((product_id), id)
) WITH CLUSTERING ORDER BY (id ASC);

COPY features_by_product (id, product_id, feature, value)
FROM '/home/blin/project-sdc/p_service/files/raw/features.csv'
WITH HEADER = TRUE AND NULL = 'null';