import { LexSqlTokens } from "./lexer";
import { ParseMigration, ParseQueryType } from "./parser";
import { GeneratedSchema } from "./state";
import { TokenizeSqlString } from "./tokenizer";

class Database<Schema extends GeneratedSchema = { tables: {} }> {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  execute(query: string): Promise<number> {
    return Promise.resolve(0);
  }

  migrate<S extends string>(
    query: S
  ): Database<ParseMigration<LexSqlTokens<TokenizeSqlString<S>>, Schema>> {
    return this;
  }

  query<S extends string>(
    query: S
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

  execute(
    resourceAddress: string,
    nftId: string | number | Uint8Array,
    query: string
  ): Promise<number> {
    return Promise.resolve(0);
  }

  migrate<S extends string>(
    query: S
  ): NftDatabase<ParseMigration<LexSqlTokens<TokenizeSqlString<S>>, Schema>> {
    return this;
  }

  query<S extends string>(
    resourceAddress: string,
    nftId: string | number | Uint8Array,
    query: S
  ): Promise<ParseQueryType<LexSqlTokens<TokenizeSqlString<S>>, Schema>> {
    return [] as any;
  }
}

export function getNftDb(name: string): NftDatabase {
  return new NftDatabase(name);
}
