import { IResponse } from "@/global";

export interface IDepartment {
  _id: string;
  name: string;
  description: string;
  status: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetDepartmentsResponse extends IResponse {
  data: IDepartment[];
}