DROP TABLE IF EXISTS product_db.related_by_current;

CREATE TABLE IF NOT EXISTS related_by_current (
  id              int,
  current_pid     int,
  related_pid     int,
  PRIMARY KEY ((current_pid), id)
) WITH CLUSTERING ORDER BY (id ASC);

COPY related_by_current (id, current_pid, related_pid)
FROM '/home/blin/project-sdc/p_service/files/related.csv'
WITH HEADER = TRUE AND NULL = '0';