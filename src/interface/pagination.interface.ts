export interface IPagination<T> {
  data: T[];
  page: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

export interface IReqPagination {
  page: number;
  limit: number;
}
