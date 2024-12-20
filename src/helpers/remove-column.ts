type RemoveColumn<
  T extends TableRecord,
  DB extends string,
  Table extends string,
  Column extends string
> = {
  [K in keyof T]: K extends `${DB}.${Table}`
    ? { [Col in keyof T[K] as Col extends Column ? never : Col]: T[K][Col] }
    : T[K];
} extends infer Result
  ? { [K in keyof Result]: Result[K] }
  : never;
