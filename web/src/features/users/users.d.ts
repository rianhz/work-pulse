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
  reportsTo: string | null;
  nickName: string | null;
  birthDate: Date | null;
  department: string | null;
  position: string | null;
  refreshToken: {
    token: string;
    expiresIn: number;
    createdAt: Date;
  } | null;
  projects: string[];
}

export interface IGetMeResponse extends IResponse {
  data: IUser;
}

export interface IGetMeProvidersResponse extends IResponse {
  data: ('password' | 'google')[];
}

export interface IGetUsersResponse extends IResponse {
  data: IUser[];
}