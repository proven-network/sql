type RenameColumn<
  T extends TableRecord,
  DB extends string,
  Table extends string,
  OldCol extends string,
  NewCol extends string
> = {
  [K in keyof T]: K extends `${DB}.${Table}`
    ? {
        [Col in keyof T[K] as Col extends OldCol ? NewCol : Col]: T[K][Col];
      }
    : T[K];
} extends infer Result
  ? { [K in keyof Result]: Result[K] }
  : never;
