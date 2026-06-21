export interface IResponse<T> {
  success: boolean;
  message: string;
}
export interface IGetPaginatedResponse<T> extends IResponse {
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IPaginationQueryOptions {
  search: string;
  page: number;
  limit: number;
}