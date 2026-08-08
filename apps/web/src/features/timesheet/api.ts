import { api } from "@/lib/axios";
import { ITimeSheet } from "./timesheet";

export const createTimesheet = async (timesheet: ITimeSheet) => {
  const response = await api.post('/timesheets', timesheet);
  return response.data.data;
};

export const getTimesheets = async () => {
  const response = await api.get('/timesheets');
  return response.data.data;
};

export const getTimesheet = async (id: string) => {
  const response = await api.get(`/timesheets/${id}`);
  return response.data.data;
};

export const updateTimesheet = async (id: string, timesheet: ITimeSheet) => {
  const response = await api.put(`/timesheets/${id}`, timesheet);
  return response.data.data;
};

export const deleteTimesheet = async (id: string) => {
  const response = await api.delete(`/timesheets/${id}`);
  return response.data.data;
};