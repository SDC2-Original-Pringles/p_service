DROP TABLE IF EXISTS product_db.photos_by_style;

CREATE TABLE IF NOT EXISTS photos_by_style (
  id              int,
  style_id        int,
  url             text,
  thumbnail_url   text,
  PRIMARY KEY ((style_id), id)
) WITH CLUSTERING ORDER BY (id ASC);

COPY photos_by_style (id, style_id, url, thumbnail_url)
FROM '/home/blin/project-sdc/p_service/files/photos.csv'
WITH HEADER = TRUE;