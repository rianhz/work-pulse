import { api } from "@/lib/axios";
import { IGetTenantByIdResponse, ITenant } from "./tenant";

export const getTenantById = async (id: string) => {
  const response = await api.get<IGetTenantByIdResponse>(`/tenants/${id}`);
  return response.data.data;
};

export const getPublicTenantById = async (id: string) => {
  const response = await api.get<IGetTenantByIdResponse>(`/tenants/public/${id}`);
  return response.data.data;
};

export const updateTenant = async (id: string, payload: Partial<ITenant>) => {
  const response = await api.put<IGetTenantByIdResponse>(`/tenants/${id}`, payload);
  return response.data.data;
};