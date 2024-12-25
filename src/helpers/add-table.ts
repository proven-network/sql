type AddTable<
  Tables extends TableRecord,
  TableName extends string,
  Columns extends CurrentColumn[]
> = {
  [K in keyof Tables | TableName]: K extends keyof Tables
    ? Tables[K]
    : K extends TableName
    ? ColumnsToRecord<Columns>
    : never;
};

type EvaluateAddTable<T> = T extends AddTable<
  infer Tables,
  infer Table,
  infer Columns
>
  ? {
      [K in keyof Tables | Table]: K extends keyof Tables
        ? Tables[K]
        : K extends Table
        ? EvaluateColumnsToRecord<ColumnsToRecord<Columns>>
        : never;
    }
  : never;
