type TestUpdate = UpdateLastColumn<
  [
    { name: "id"; type: "INTEGER"; isNullable: true },
    { name: "title"; type: "TEXT"; isNullable: true }
  ],
  { isNullable: false }
>;

type TestTableRecord = {
  "schema.users": {
    id: { type: "INTEGER"; isNullable: false };
    name: { type: "TEXT"; isNullable: false };
    email: { type: "TEXT"; isNullable: true };
  };
  "schema.posts": {
    id: { type: "INTEGER"; isNullable: false };
    title: { type: "TEXT"; isNullable: false };
    content: { type: "TEXT"; isNullable: true };
  };
};

type TestRemoveColumn = RemoveColumn<
  TestTableRecord,
  "schema",
  "users",
  "email"
>;

type TestRenameColumn = RenameColumn<
  TestTableRecord,
  "schema",
  "users",
  "name",
  "full_name"
>;

type TestSchemaStateFirstTable = ParseMigration<
  LexSqlTokens<
    TokenizeSqlString<`create table schema.posts (
        id integer primary KEY,
        title text not null,
        content text,
        creator text not null,
        created_at integer not null,
        updated_at integer not null
      );`>
  >
>;

type TestSchemaStateSecondTable = ParseMigration<
  LexSqlTokens<
    TokenizeSqlString<`CREATE TABLE schema.likes (
        post_id INTEGER NOT NULL,
        user_id TEXT NOT NULL
      );`>
  >,
  TestSchemaStateFirstTable
>;

type TestTokens = LexSqlTokens<
  TokenizeSqlString<`ALTER TABLE schema.likes DROP COLUMN user_id;`>
>;

type TestSchemaStateAlterTableDropCol = ParseMigration<
  LexSqlTokens<
    TokenizeSqlString<`ALTER TABLE schema.likes DROP COLUMN user_id`>
  >,
  TestSchemaStateSecondTable
>;

type TestSchemaStateAlterTableRenameCol = ParseMigration<
  LexSqlTokens<
    TokenizeSqlString<`ALTER TABLE schema.likes RENAME COLUMN post_id TO new_post_id;`>
  >,
  TestSchemaStateSecondTable
>;

type TestTableBasic = {
  "schema.test": {
    id: { type: "INTEGER"; isNullable: false };
    name: { type: "TEXT"; isNullable: true };
  };
};

type TestRemoveBasic = RemoveColumn<TestTableBasic, "schema", "test", "name">;

type TestAlterTokens = LexSqlTokens<
  TokenizeSqlString<"ALTER TABLE schema.test RENAME COLUMN name TO full_name;">
>;

type TestAlterParse = ParseAlterTable<
  TestAlterTokens,
  { tables: TestTableBasic }
>;

type TestRenameColumnSimple = RenameColumn<
  {
    "schema.test": {
      id: { type: "INTEGER"; isNullable: false };
      old_name: { type: "TEXT"; isNullable: true };
    };
  },
  "schema",
  "test",
  "old_name",
  "new_name"
>;

type TestRemoveTableSimple = RemoveTable<
  {
    "schema.test": {
      id: { type: "INTEGER"; isNullable: false };
      name: { type: "TEXT"; isNullable: true };
    };
    "schema.test2": {
      id: { type: "INTEGER"; isNullable: false };
      name: { type: "TEXT"; isNullable: true };
    };
  },
  "schema",
  "test"
>;

type TestSchemaStateAlterTableDropTable = ParseMigration<
  LexSqlTokens<TokenizeSqlString<`DROP TABLE schema.likes;`>>,
  TestSchemaStateSecondTable
>;

// Query parsing test cases
type TestQuerySchema = {
  tables: {
    "schema.posts": {
      id: { type: "INTEGER"; isNullable: false };
      title: { type: "TEXT"; isNullable: false };
      content: { type: "TEXT"; isNullable: true };
      published_at: { type: "INTEGER"; isNullable: false };
    };
  };
};

// Test SELECT * parsing
type TestSelectAllTokens = LexSqlTokens<
  TokenizeSqlString<"SELECT * FROM schema.posts">
>;

type TestSelectAllQuery = ParseQueryType<TestSelectAllTokens, TestQuerySchema>;
// Should equal: { id: number; title: string; content: string | null; published_at: number; }[]

// Test specific columns
type TestSelectColumnsTokens = LexSqlTokens<
  TokenizeSqlString<"SELECT title, content FROM schema.posts">
>;

type TestSelectColumnsQuery = ParseQueryType<
  TestSelectColumnsTokens,
  TestQuerySchema
>;
// Should equal: { title: string; content: string | null; }[]

// Test state accumulation
type TestQueryState = ParseSelectColumns<
  TestSelectColumnsTokens,
  TestQuerySchema,
  {
    currentDatabase: never;
    currentTableName: never;
    allColumns: false;
    specificColumns: [];
  }
>;
// Should show state with accumulated columns ["title", "content"]

// Query parsing - step by step tests
type TestQueryTokens = LexSqlTokens<
  TokenizeSqlString<"SELECT * FROM schema.posts">
>;
// Should show: [{ type: "KEYWORD", value: "SELECT" }, { type: "SYMBOL", value: "*" }, ...]

type TestInitialState = {
  currentDatabase: never;
  currentTableName: never;
  allColumns: false;
  specificColumns: [];
};

// Test each parsing step
type TestAfterSelect = ParseSelectColumns<
  [
    { type: "IDENTIFIER"; value: "*" },
    { type: "KEYWORD"; value: "FROM" },
    { type: "IDENTIFIER"; value: "schema.posts" }
  ],
  TestQuerySchema,
  TestInitialState
>;

type TestAfterStar = ParseFromClause<
  [
    { type: "KEYWORD"; value: "FROM" },
    { type: "IDENTIFIER"; value: "schema.posts" }
  ],
  TestQuerySchema,
  {
    currentDatabase: never;
    currentTableName: never;
    allColumns: true;
    specificColumns: [];
  }
>;

// Test table columns extraction
type TestTableColumns = GetTableColumns<TestQuerySchema, "schema", "posts">;
type TestTableResult = TableColumnsToResult<TestTableColumns>;
