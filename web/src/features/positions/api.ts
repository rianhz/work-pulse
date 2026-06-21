import { IPosition, IPositionResponse } from "./positions";
import { api } from "@/lib/axios";

export const getPositions = async (tenantId: string) => {
  const response = await api.get<IPositionResponse<IPosition[]>>(`/positions?tenantId=${tenantId}`);
  return response.data;
}

export const getPositionById = async (id: string) => {
  const response = await api.get<IPositionResponse<IPosition>>(`/positions/${id}`);
  return response.data;
}

export const createPosition = async (payload: {name: string }) => {
  const response = await api.post<IPositionResponse<IPosition>>('/positions', payload);
  return response.data;
}

export const updatePosition = async (id: string, payload: {name: string, status?: 'active' | 'disabled' | 'deleted' }) => {
  console.log(payload);
  console.log(id);
  const response = await api.put(`/positions/${id}`, payload);
  return response.data;
}

export const deletePosition = async (id: string) => {
  const response = await api.delete(`/positions/${id}`);
  return response.data;
}

export const disablePosition = async (id: string) => {
  const response = await api.put(`/positions/${id}/disable`);
  return response.data;
}

export const enablePosition = async (id: string) => {
  const response = await api.put(`/positions/${id}/enable`);
  return response.data;
}