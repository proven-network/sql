import { LexSqlTokens } from "./lexer";
import { ParseMigration, ParseQueryType } from "./parser";
import { GeneratedSchema } from "./state";
import { TokenizeSqlString } from "./tokenizer";

class Sql<S extends string> {
  readonly params: Record<string, null | number | string | Uint8Array>;
  readonly statement: S;

  constructor(
    statement: S,
    params?: Record<string, null | number | string | Uint8Array>
  ) {
    this.statement = statement;
    this.params = params || {};
  }
}

export function sql<S extends string>(
  statement: S,
  params: Record<string, null | number | string | Uint8Array>
): Sql<S> {
  return new Sql<S>(statement, params);
}

type FirstRowValue =
  | { BlobWithName: [string, Uint8Array] }
  | { IntegerWithName: [string, number] }
  | { NullWithName: string }
  | { RealWithName: [string, number] }
  | { TextWithName: [string, string] };

type FirstRow = FirstRowValue[];

class Rows<T extends Record<string, null | number | string | Uint8Array>> {
  [index: number]: T | undefined;
  columnNames: Readonly<string[]>;

  get length(): Promise<number> {
    return Promise.resolve(0);
  }

  constructor(firstRow: FirstRow, rowStreamId: number) {
    this.columnNames = [];
  }

  [Symbol.iterator](): Iterator<T> {
    return [][Symbol.iterator]();
  }

  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[] {
    return [].map(callbackfn);
  }

  filter(predicate: (value: T, index: number, array: T[]) => boolean): T[] {
    return [].filter(predicate);
  }

  forEach(callbackfn: (value: T, index: number, array: T[]) => void): void {
    [].forEach(callbackfn);
  }
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
    query: S
  ): Database<ParseMigration<LexSqlTokens<TokenizeSqlString<S>>, Schema>> {
    return this;
  }

  query<S extends string>(
    query: S | Sql<S>
  ): Promise<Rows<ParseQueryType<LexSqlTokens<TokenizeSqlString<S>>, Schema>>> {
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
    query: S
  ): NftDatabase<ParseMigration<LexSqlTokens<TokenizeSqlString<S>>, Schema>> {
    return this;
  }

  query<S extends string>(
    resourceAddress: string,
    nftId: string | number | Uint8Array,
    query: S | Sql<S>
  ): Promise<Rows<ParseQueryType<LexSqlTokens<TokenizeSqlString<S>>, Schema>>> {
    return [] as any;
  }
}

export function getNftDb(name: string): NftDatabase {
  return new NftDatabase(name);
}
