type AddTable<
  Tables extends TableRecord,
  Database extends string,
  TableName extends string,
  Columns extends CurrentColumn[]
> = {
  [K in keyof Tables | `${Database}.${TableName}`]: K extends keyof Tables
    ? Tables[K]
    : K extends `${Database}.${TableName}`
    ? ColumnsToRecord<Columns>
    : never;
};

type EvaluateAddTable<T> = T extends AddTable<
  infer Tables,
  infer Database,
  infer Table,
  infer Columns
>
  ? {
      [K in keyof Tables | `${Database}.${Table}`]: K extends keyof Tables
        ? Tables[K]
        : K extends `${Database}.${Table}`
        ? EvaluateColumnsToRecord<ColumnsToRecord<Columns>>
        : never;
    }
  : never;
