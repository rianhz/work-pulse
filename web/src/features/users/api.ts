import { AxiosError, RawAxiosRequestHeaders } from "axios";
import { IGetMeProvidersResponse, IGetMeResponse, IGetUsersResponse, IUser } from "./users";
import { api } from "@/lib/axios";
import { IResponse } from "@/global";

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

export const getUsers = async () => {
  try {
    const response = await api.get<IGetUsersResponse>("/users");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};