import { LexSqlTokens } from "./lexer";
import { ParseMigration, ParseQueryType } from "./parser";
import { GeneratedSchema } from "./state";
import { TokenizeSqlString } from "./tokenizer";

class TypedDatabase<Schema extends GeneratedSchema = { tables: {} }> {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  execute(query: string): number {
    return 0;
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

export function getPersonalDb(name: string): TypedDatabase {
  return new TypedDatabase(name);
}
