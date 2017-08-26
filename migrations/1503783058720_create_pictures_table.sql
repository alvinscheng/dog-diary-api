-- up
create table pictures (
  id serial,
  picture text,
  note text,
  dog_id integer,
  date timestamp
);

---

-- down
drop table if exists pictures;
