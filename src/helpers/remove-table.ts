type RemoveTable<
  T extends TableRecord,
  DB extends string,
  Table extends string
> = {
  [K in keyof T as K extends `${DB}.${Table}` ? never : K]: T[K];
} extends infer Result
  ? { [K in keyof Result]: Result[K] }
  : never;
