export interface IBaseResponse {
  success: boolean;
  message: string;
}

export interface IBaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResponse<T> extends IBaseResponse {
  data: T;
}
export interface IGetPaginatedResponse<T> extends IBaseResponse {
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