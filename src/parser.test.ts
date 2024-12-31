import { LexSqlTokens } from "./lexer";
import { ParseMigration, ParseQueryType } from "./parser";
import { TokenizeSqlString } from "./tokenizer";

import { UpdateLastColumn } from "./helpers/merge-column";
import { RemoveColumn } from "./helpers/remove-column";
import { RemoveTable } from "./helpers/remove-table";
import { RenameColumn } from "./helpers/rename-column";

type TestUpdate = UpdateLastColumn<
  [
    { name: "id"; type: "INTEGER"; isNullable: true },
    { name: "title"; type: "TEXT"; isNullable: true },
  ],
  { isNullable: false }
>;

type TestTableRecord = {
  users: {
    id: { type: "INTEGER"; isNullable: false };
    name: { type: "TEXT"; isNullable: false };
    email: { type: "TEXT"; isNullable: true };
  };
  posts: {
    id: { type: "INTEGER"; isNullable: false };
    title: { type: "TEXT"; isNullable: false };
    content: { type: "TEXT"; isNullable: true };
  };
};

type TestRemoveColumn = RemoveColumn<TestTableRecord, "users", "email">;

type TestRenameColumn = RenameColumn<
  TestTableRecord,
  "users",
  "name",
  "full_name"
>;

type TestSchemaStateFirstTable = ParseMigration<
  LexSqlTokens<
    TokenizeSqlString<`create table posts (
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
    TokenizeSqlString<`CREATE TABLE likes (
        post_id INTEGER NOT NULL,
        user_id TEXT NOT NULL
      );`>
  >,
  TestSchemaStateFirstTable
>;

type TestTokens = LexSqlTokens<
  TokenizeSqlString<`ALTER TABLE likes DROP COLUMN user_id;`>
>;

type TestSchemaStateAlterTableDropCol = ParseMigration<
  LexSqlTokens<TokenizeSqlString<`ALTER TABLE likes DROP COLUMN user_id`>>,
  TestSchemaStateSecondTable
>;

type TestSchemaStateAlterTableRenameCol = ParseMigration<
  LexSqlTokens<
    TokenizeSqlString<`ALTER TABLE likes RENAME COLUMN post_id TO new_post_id;`>
  >,
  TestSchemaStateSecondTable
>;

type TestTableBasic = {
  test: {
    id: { type: "INTEGER"; isNullable: false };
    name: { type: "TEXT"; isNullable: true };
  };
};

type TestRemoveBasic = RemoveColumn<TestTableBasic, "test", "name">;

type TestAlterTokens = LexSqlTokens<
  TokenizeSqlString<"ALTER TABLE test RENAME COLUMN name TO full_name;">
>;

type TestAlterParse = ParseMigration<
  TestAlterTokens,
  { tables: TestTableBasic }
>;

type TestRenameColumnSimple = RenameColumn<
  {
    test: {
      id: { type: "INTEGER"; isNullable: false };
      old_name: { type: "TEXT"; isNullable: true };
    };
  },
  "test",
  "old_name",
  "new_name"
>;

type TestRemoveTableSimple = RemoveTable<
  {
    test: {
      id: { type: "INTEGER"; isNullable: false };
      name: { type: "TEXT"; isNullable: true };
    };
    test2: {
      id: { type: "INTEGER"; isNullable: false };
      name: { type: "TEXT"; isNullable: true };
    };
  },
  "test"
>;

type TestSchemaStateAlterTableDropTable = ParseMigration<
  LexSqlTokens<TokenizeSqlString<`DROP TABLE likes;`>>,
  TestSchemaStateSecondTable
>;

// Query parsing test cases
type TestQuerySchema = {
  tables: {
    posts: {
      id: { type: "INTEGER"; isNullable: false };
      title: { type: "TEXT"; isNullable: false };
      content: { type: "TEXT"; isNullable: true };
      published_at: { type: "INTEGER"; isNullable: false };
    };
  };
};

type TestSelectAllTokens = LexSqlTokens<
  TokenizeSqlString<"SELECT * FROM posts">
>;

type TestSelectAllQuery = ParseQueryType<TestSelectAllTokens, TestQuerySchema>;

type TestSelectColumnsTokens = LexSqlTokens<
  TokenizeSqlString<"SELECT title, content FROM posts">
>;

type TestSelectColumnsQuery = ParseQueryType<
  TestSelectColumnsTokens,
  TestQuerySchema
>;
