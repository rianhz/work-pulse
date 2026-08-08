import { api } from "@/lib/axios";
import { IProjectPayload, IGetProjectsByBulkIdsResponse, IProject } from "./project";
import { IBaseResponse, IGetPaginatedResponse, IPaginationQueryOptions, IResponse } from "@/global";

export const getProjectsByBulkIds = async (ids: string[]): Promise<IProject[]> => {
  try {
    const response = await api.post<IGetProjectsByBulkIdsResponse>('/projects/bulk', { ids });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getProjects = async (options: IPaginationQueryOptions): Promise<any> => {
  try {
    const response = await api.get<IGetPaginatedResponse<IProject[]>>('/projects', { params: options });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createProject = async (payload:IProjectPayload): Promise<IBaseResponse> => {
  try {
    const response = await api.post<IBaseResponse>('/projects', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProject = async (projectId: string, payload: IProjectPayload) => {
  try {
    const response = await api.put(`/projects/${projectId}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMeProjects = async (): Promise<IProject[]> => {
  try {
    const response = await api.get('/users/me/projects');
    return response.data.data
  } catch (error) {
    throw error;
  }
};