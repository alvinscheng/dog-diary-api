-- up
create table dogs (
  id serial,
  name text,
  age text,
  profile_picture text
);

---

-- down
drop table if exists dogs;
