import { IResponse } from "@/global";
import { ILoginPayload, ILoginResponse, IRegisterPayload } from "./auth";
import { api } from "@/lib/axios";

export const login = async (payload: ILoginPayload) => {
  try {
    const response = await api.post<ILoginResponse>(`/auth/login`, payload);
    return response.data
  } catch (error) {
    throw error;
  }
};

export const register = async (payload: IRegisterPayload) => {
  try {
    const response = await api.post<IResponse<void>>(`/auth/register`, payload);
    return response.data
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post(`/auth/logout`);
  } catch (error) {
    throw error;
  }
};