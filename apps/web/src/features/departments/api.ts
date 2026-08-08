import { DepartmentSchema } from "./validator";
import { api } from "@/lib/axios";
import { IGetDepartmentsResponse } from "./departments";

export const createDepartment = async (data: DepartmentSchema) => {
  const response = await api.post('/departments', data);
  return response.data;
};

export const getDepartments = async () => {
  const response = await api.get<IGetDepartmentsResponse>('/departments');
  return response.data.data
};

export const getDepartment = async (id: string) => {
  const response = await api.get(`/departments/${id}`);
  return response.data;
};

export const updateDepartment = async (id: string, data: DepartmentSchema) => {
  const response = await api.put(`/departments/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (id: string) => {
  const response = await api.patch(`/departments/delete/${id}`);
  return response.data;
};

export const disableDepartment = async (id: string) => {
  const response = await api.patch(`/departments/disable/${id}`);
  return response.data;
};

export const enableDepartment = async (id: string) => {
  const response = await api.patch(`/departments/enable/${id}`);
  return response.data;
};