-- up
create table pictures (
  id serial,
  picture text,
  note text,
  dog_id integer,
  key text,
  date text
);

---

-- down
drop table if exists pictures;
