import { IResponse } from "@/global";

export interface IPosition {
  _id: string;
  tenantId: string;
  name: string;
  status: 'active' | 'disabled' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

export interface IPositionResponse<T> extends IResponse {
  data: T;
}