import { api } from "@/lib/axios";
import { ITenantSettings } from "./tenantSettings";
import { IResponse } from "@/global";

export const getTenantSettings = async (id: string) => {
  const response = await api.get<IResponse<ITenantSettings>>(`/tenants/settings/${id}`);
  return response.data.data;
};

export const updateTenantSettings = async (id: string, payload: Partial<ITenantSettings>) => {
  const response = await api.put<IResponse<ITenantSettings>>(`/tenants/settings/${id}`, payload);
  return response.data.data;
};
