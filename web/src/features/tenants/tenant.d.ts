import { IResponse } from "@/global";

export interface ITenant {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  projects: string[];
  plan: string;
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetTenantByIdResponse extends IResponse {
  data?: ITenant;
}