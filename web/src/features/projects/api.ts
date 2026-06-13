import { api } from "@/lib/axios";
import { IGetProjectsByBulkIdsResponse, IProject } from "./project";

export const getProjectsByBulkIds = async (ids: string[]): Promise<IProject[]> => {
  try {
    const response = await api.post<IGetProjectsByBulkIdsResponse>('/projects/bulk', { ids });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};