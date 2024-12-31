import { getApplicationDb } from "./index";

const DB = getApplicationDb("main")
  .migrate(
    `
  CREATE TABLE posts (
    id integer primary KEY,
    title text not null,
    content text,
    creator text not null,
    created_at integer not null,
    updated_at integer not null
  );`
  )
  .migrate(
    `
  CREATE TABLE likes (
    post_id INTEGER NOT NULL,
    user_id TEXT NOT NULL
  );`
  )
  .migrate(`ALTER TABLE posts DROP COLUMN updated_at;`)
  .migrate(`ALTER TABLE posts RENAME COLUMN created_at TO published_at;`)
  .migrate(`DROP TABLE likes;`)
  .migrate(
    `ALTER TABLE posts ADD COLUMN updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP;`
  );

const rows = DB.query("SELECT * FROM posts");
