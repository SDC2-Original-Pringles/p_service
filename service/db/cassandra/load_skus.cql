DROP TABLE IF EXISTS product_db.skus_by_style;

CREATE TABLE IF NOT EXISTS skus_by_style (
  id              int,
  style_id        int,
  size            text,
  quantity        int,
  PRIMARY KEY ((style_id), id)
) WITH CLUSTERING ORDER BY (id ASC);

COPY skus_by_style (id, style_id, size, quantity)
FROM '/home/blin/project-sdc/p_service/files/raw/skus.csv'
WITH HEADER = TRUE;