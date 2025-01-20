import { LexSqlTokens } from "./lexer";
import { ParseMigration, ParseQueryType } from "./parser";
import { GeneratedSchema } from "./state";
import { TokenizeSqlString } from "./tokenizer";

class Sql<S extends string> {
  readonly params: Record<string, null | number | string | Uint8Array>;
  readonly statement: S;

  constructor(
    statement: S,
    params: Record<string, null | number | string | Uint8Array> = {}
  ) {
    this.statement = statement;
    this.params = params;
  }
}

export function sql<S extends string>(
  statement: S,
  params: Record<string, null | number | string | Uint8Array>
): Sql<S> {
  return new Sql<S>(statement, params);
}

class Database<Schema extends GeneratedSchema = { tables: {} }> {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  execute<S extends string>(query: S | Sql<S>): Promise<number> {
    return Promise.resolve(0);
  }

  migrate<S extends string>(
    query: S | Sql<S>
  ): Database<ParseMigration<LexSqlTokens<TokenizeSqlString<S>>, Schema>> {
    return this;
  }

  query<S extends string>(
    query: S | Sql<S>
  ): Promise<ParseQueryType<LexSqlTokens<TokenizeSqlString<S>>, Schema>> {
    return [] as any;
  }
}

export function getApplicationDb(name: string): Database {
  return new Database(name);
}

export function getPersonalDb(name: string): Database {
  return new Database(name);
}

class NftDatabase<Schema extends GeneratedSchema = { tables: {} }> {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  execute<S extends string>(
    resourceAddress: string,
    nftId: string | number | Uint8Array,
    query: S | Sql<S>
  ): Promise<number> {
    return Promise.resolve(0);
  }

  migrate<S extends string>(
    query: S | Sql<S>
  ): NftDatabase<ParseMigration<LexSqlTokens<TokenizeSqlString<S>>, Schema>> {
    return this;
  }

  query<S extends string>(
    resourceAddress: string,
    nftId: string | number | Uint8Array,
    query: S | Sql<S>
  ): Promise<ParseQueryType<LexSqlTokens<TokenizeSqlString<S>>, Schema>> {
    return [] as any;
  }
}

export function getNftDb(name: string): NftDatabase {
  return new NftDatabase(name);
}
