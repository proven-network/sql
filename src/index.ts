class TypedDatabase<Schema extends GeneratedSchema = { tables: {} }> {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  migrate<S extends string>(
    query: S
  ): TypedDatabase<ParseMigration<LexSqlTokens<TokenizeSqlString<S>>, Schema>> {
    return this;
  }

  query<S extends string>(
    query: S
  ): ParseQueryType<LexSqlTokens<TokenizeSqlString<S>>, Schema> {
    return [] as any;
  }
}

export function getApplicationDb(name: string): TypedDatabase {
  return new TypedDatabase(name);
}

const DB = getApplicationDb("main")
  .migrate(
    `
  CREATE TABLE schema.posts (
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
  CREATE TABLE schema.likes (
    post_id INTEGER NOT NULL,
    user_id TEXT NOT NULL
  );`
  )
  .migrate(`ALTER TABLE schema.posts DROP COLUMN updated_at;`)
  .migrate(
    `ALTER TABLE schema.posts RENAME COLUMN created_at TO published_at;`
  );

const test = DB.query("SELECT * FROM schema.posts");
