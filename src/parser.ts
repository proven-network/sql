// FINAL OUTPUT TYPES
type ColumnDetails = {
  type: string;
  isNullable: boolean;
};

type ColumnRecord = Record<string, ColumnDetails>;
type TableRecord = Record<string, ColumnRecord>;

type GeneratedSchema = {
  tables: TableRecord;
};

type InitialGeneratedSchema = {
  tables: {};
};

// INTERMEDIATE STATES
type CurrentColumn = {
  name: string;
  type: string;
  isNullable: boolean;
};

type CreateTableState = {
  currentDatabase: string;
  currentTableName: string;
  currentColumns: CurrentColumn[];
};

type InitialCreateTableState = {
  currentDatabase: never;
  currentTableName: never;
  currentColumns: CurrentColumn[];
};

type AlterTableState = {
  currentDatabase: string;
  currentTableName: string;
};

type InitialAlterTableState = {
  currentDatabase: never;
  currentTableName: never;
};

type DropTableState = {
  currentDatabase: string;
  currentTableName: string;
};

type InitialDropTableState = {
  currentDatabase: never;
  currentTableName: never;
};

// PARSERS

type ParseColumnDefinitions<
  Tokens extends readonly any[],
  Schema extends GeneratedSchema,
  State extends CreateTableState
> = Tokens extends [infer First, ...infer Rest]
  ? First extends { type: "KEYWORD"; value: "CREATE TABLE" }
    ? ParseColumnDefinitions<Rest, Schema, State>
    : First extends { type: "IDENTIFIER"; value: string }
    ? ParseColumnDefinitions<
        Rest,
        Schema,
        {
          currentDatabase: State["currentDatabase"];
          currentTableName: State["currentTableName"];
          currentColumns: [
            ...State["currentColumns"],
            { name: First["value"]; type: ""; isNullable: true }
          ];
        }
      >
    : First extends { type: "TYPE"; value: string }
    ? ParseColumnDefinitions<
        Rest,
        Schema,
        {
          currentDatabase: State["currentDatabase"];
          currentTableName: State["currentTableName"];
          currentColumns: UpdateLastColumn<
            State["currentColumns"],
            { type: First["value"] }
          >;
        }
      >
    : First extends { type: "KEYWORD"; value: "PRIMARY KEY" | "NOT NULL" }
    ? ParseColumnDefinitions<
        Rest,
        Schema,
        {
          currentDatabase: State["currentDatabase"];
          currentTableName: State["currentTableName"];
          currentColumns: UpdateLastColumn<
            State["currentColumns"],
            { isNullable: false }
          >;
        }
      >
    : First extends { type: "SYMBOL"; value: ")" }
    ? {
        tables: EvaluateAddTable<
          AddTable<
            Schema["tables"],
            State["currentDatabase"],
            State["currentTableName"],
            State["currentColumns"]
          >
        >;
      }
    : ParseColumnDefinitions<Rest, Schema, State>
  : never;

type ParseCreateTable<
  Tokens extends readonly any[],
  Schema extends GeneratedSchema = InitialGeneratedSchema,
  State extends CreateTableState = InitialCreateTableState
> = Tokens extends [infer First, ...infer Rest]
  ? First extends {
      type: "IDENTIFIER";
      value: `${infer Database}.${infer Table}`;
    }
    ? ParseCreateTable<
        Rest,
        Schema,
        {
          currentDatabase: Database;
          currentTableName: Table;
          currentColumns: [];
        }
      >
    : First extends { type: "SYMBOL"; value: "(" }
    ? ParseColumnDefinitions<Rest, Schema, State>
    : never
  : never;

type ParseAlterTable<
  Tokens extends readonly any[],
  Schema extends GeneratedSchema = InitialGeneratedSchema,
  State extends AlterTableState = InitialAlterTableState
> = Tokens extends [infer First, ...infer Rest]
  ? First extends {
      type: "IDENTIFIER";
      value: `${infer Database}.${infer Table}`;
    }
    ? ParseAlterTableAction<
        Rest,
        Schema,
        {
          currentDatabase: Database;
          currentTableName: Table;
        }
      >
    : ParseAlterTable<Rest, Schema, State>
  : Schema;

type ParseAlterTableAction<
  Tokens extends readonly any[],
  Schema extends GeneratedSchema,
  State extends AlterTableState
> = Tokens extends [infer First, ...infer Rest]
  ? First extends { type: "KEYWORD"; value: "ADD COLUMN" }
    ? ParseAddColumn<Rest, Schema, State>
    : First extends { type: "KEYWORD"; value: "ADD" }
    ? ParseAddColumn<Rest, Schema, State>
    : First extends { type: "KEYWORD"; value: "DROP COLUMN" }
    ? ParseDropColumn<Rest, Schema, State>
    : First extends { type: "KEYWORD"; value: "DROP" } // COLUMN optional
    ? ParseDropColumn<Rest, Schema, State>
    : First extends { type: "KEYWORD"; value: "RENAME COLUMN" }
    ? ParseRenameColumn<Rest, Schema, State>
    : First extends { type: "KEYWORD"; value: "RENAME" } // COLUMN optional
    ? ParseRenameColumn<Rest, Schema, State>
    : ParseAlterTableAction<Rest, Schema, State>
  : Schema;

type ParseAddColumn<
  Tokens extends readonly any[],
  Schema extends GeneratedSchema,
  State extends AlterTableState
> = Tokens extends [
  { type: "IDENTIFIER"; value: infer Column extends string },
  { type: "TYPE"; value: infer Type extends string },
  ...infer Rest
]
  ? Rest extends [
      { type: "KEYWORD"; value: "PRIMARY KEY" | "NOT NULL" },
      ...infer RestAfterConstraint
    ]
    ? {
        tables: AddColumn<
          Schema["tables"],
          State["currentDatabase"],
          State["currentTableName"],
          Column,
          { type: Type; isNullable: false }
        >;
      }
    : {
        tables: AddColumn<
          Schema["tables"],
          State["currentDatabase"],
          State["currentTableName"],
          Column,
          { type: Type; isNullable: true }
        >;
      }
  : Schema;

type ParseDropColumn<
  Tokens extends readonly any[],
  Schema extends GeneratedSchema,
  State extends AlterTableState
> = Tokens extends [
  { type: "IDENTIFIER"; value: infer Column extends string },
  ...infer Rest
]
  ? {
      tables: RemoveColumn<
        Schema["tables"],
        State["currentDatabase"],
        State["currentTableName"],
        Column
      >;
    }
  : Schema;

type ParseRenameColumn<
  Tokens extends readonly any[],
  Schema extends GeneratedSchema,
  State extends AlterTableState
> = Tokens extends [
  { type: "IDENTIFIER"; value: infer OldColumn },
  { type: "KEYWORD"; value: "TO" },
  { type: "IDENTIFIER"; value: infer NewColumn },
  ...infer Rest
]
  ? {
      tables: RenameColumn<
        Schema["tables"],
        State["currentDatabase"],
        State["currentTableName"],
        OldColumn & string,
        NewColumn & string
      >;
    }
  : Schema;

type ParseDropTable<
  Tokens extends readonly any[],
  Schema extends GeneratedSchema = InitialGeneratedSchema,
  State extends DropTableState = InitialDropTableState
> = Tokens extends [infer First, ...infer Rest]
  ? First extends {
      type: "IDENTIFIER";
      value: `${infer Database}.${infer Table}`;
    }
    ? { tables: RemoveTable<Schema["tables"], Database, Table> }
    : ParseDropTable<Rest, Schema, State>
  : Schema;

type ParseMigration<
  Tokens extends readonly any[],
  Schema extends GeneratedSchema = InitialGeneratedSchema
> = Tokens extends [infer First, ...infer Rest]
  ? First extends { type: "KEYWORD"; value: "CREATE TABLE" }
    ? ParseCreateTable<Rest, Schema>
    : First extends { type: "KEYWORD"; value: "ALTER TABLE" }
    ? ParseAlterTable<Rest, Schema>
    : First extends { type: "KEYWORD"; value: "DROP TABLE" }
    ? ParseDropTable<Rest, Schema>
    : ParseMigration<Rest, Schema>
  : Schema;

type ParseQueryType<
  Tokens extends readonly any[],
  Schema extends GeneratedSchema = InitialGeneratedSchema,
  State extends CreateTableState = InitialCreateTableState
> = Tokens extends [infer First, ...infer Rest] ? any[] : any[];
