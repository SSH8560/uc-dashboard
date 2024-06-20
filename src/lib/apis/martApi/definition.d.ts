type Pageable = {
  pageNumber: number;
  pageSize: number;
};

export type Page<T> = {
  content: T[];
  pageable: Pageable;
};
