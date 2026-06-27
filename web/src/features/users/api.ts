import { AxiosError, RawAxiosRequestHeaders } from "axios";
import { IGetMeProvidersResponse, IGetMeResponse, IUser } from "./users";
import { api } from "@/lib/axios";
import { IGetPaginatedResponse, IPaginationQueryOptions } from "@/global";

export const getMe = async (headers?: RawAxiosRequestHeaders) => {
  try {
    const response = await api.get<IGetMeResponse>("/users/me", { headers });
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || error.response?.data.error || 'Failed to get profile');
    }
    throw new Error('Failed to get profile');
  }
};

export const getMeProviders = async () => {
  try {
    const response = await api.get<IGetMeProvidersResponse>("/users/me/providers");
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || error.response?.data.error || 'Failed to get providers');
    }
    throw new Error('Failed to get providers');
  }
};

export const updateUser = async (userId: string, payload: Partial<IUser>) => {
  try {
    const response = await api.put(`/users/update/${userId}`, payload);
    return response.data
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (params: IPaginationQueryOptions) => {
  try {
    const response = await api.get<IGetPaginatedResponse<IUser[]>>("/users", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchUsers = async (query: string) => {
  try {
    const response = await api.get<{ data: IUser[] }>(`/users/search?search=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};