import { IResponse } from "@/global";

export interface IUser {
  _id: string;
  tenantId: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: {
    token: string;
    expiresIn: number;
    createdAt: Date;
  } | null;
}

export interface IGetMeResponse extends IResponse {
  data: IUser;
}