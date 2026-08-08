import { api } from "@/lib/axios";
import { ILeaveBalance, ILeaveRequest } from "./leave";
import { IBaseResponse, IGetPaginatedResponse, IPaginationQueryOptions, IResponse } from "@/global";

export const getMyLeaveBalance = async () => {
  const response = await api.get<IResponse<ILeaveBalance>>('/leave/balance/me');
  return response.data;
}

export const getMyLeaveRequests = async (options: IPaginationQueryOptions) => {
  const response = await api.get<IGetPaginatedResponse<ILeaveRequest[]>>('/leave/requests/me', { params: options });
  return response.data;
}

export const createLeaveRequest = async (dto: Partial<ILeaveRequest>) => {
  const response = await api.post<IBaseResponse>('/leave/requests', dto);
  return response.data;
}

export const getLeaveApprovals = async (options: IPaginationQueryOptions) => {
  const response = await api.get<IGetPaginatedResponse<ILeaveRequest[]>>('/leave/requests', { params: options });
  return response.data;
}

export const getLeaveRequestById = async (id: string) => {
  const response = await api.get<IResponse<ILeaveRequest>>(`/leave/requests/${id}`);
  return response.data;
}