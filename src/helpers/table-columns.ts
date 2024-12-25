type GetTableColumns<
  Schema extends GeneratedSchema,
  DB extends string,
  Table extends string
> = Schema["tables"][`${DB}.${Table}`];

type ColumnToType<T extends ColumnDetails> = T["type"] extends "INTEGER"
  ? number
  : T["type"] extends "TEXT"
  ? string
  : T["type"] extends "REAL"
  ? number
  : T["type"] extends "BLOB"
  ? Uint8Array
  : never;
