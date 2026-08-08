import { IResponse } from "@/global";
import { IDepartment } from "../departments/departments";

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
  leader: IUser | null;
  nickName: string | null;
  birthDate: string | null;
  department: IDepartment | null;
  position: string;
  timezone: string;
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