import { Request } from "express";
import { AuthUser } from "./authentication/interfaces";

export interface QueryOptions {
  search?: string;
  page: number;
  limit: number;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface BaseRequest extends Request {
  user?: AuthUser;
}

export interface BaseResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationResponse;
}
