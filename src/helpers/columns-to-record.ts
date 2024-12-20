type ColumnsToRecord<Cols extends CurrentColumn[]> = {
  [K in Cols[number]["name"]]: Extract<Cols[number], { name: K }>;
};

type EvaluateColumnsToRecord<T> = T extends ColumnsToRecord<infer Cols>
  ? {
      [K in Cols[number]["name"]]: Extract<
        Cols[number],
        { name: K }
      > extends infer Col
        ? Col extends CurrentColumn
          ? {
              type: Col["type"];
              isNullable: Col["isNullable"];
            }
          : never
        : never;
    }
  : never;
