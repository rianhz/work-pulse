import { api } from "@/lib/axios";
import { IGetTenantByIdResponse } from "./tenant";

export const getTenantById = async (id: string) => {
  const response = await api.get<IGetTenantByIdResponse>(`/tenants/${id}`);
  return response.data.data;
};