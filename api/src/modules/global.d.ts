export interface IResponse<T> {
  success: boolean;
  message: string;
}

export interface QueryOptions {
  search: string;
  page: number;
  limit: number;
}