import { IResponse } from "@/global";
import { IChangePasswordPayload, ILoginPayload, ILoginResponse, IRegisterPayload, IRegisterWithGooglePayload } from "./auth";
import { api } from "@/lib/axios";
import { IUser } from "../users/users";

export const login = async (payload: ILoginPayload) => {
  try {
    const response = await api.post<ILoginResponse>(`/auth/signin`, payload);
    return response.data
  } catch (error) {
    throw error;
  }
};

export const googleLogin = async (token: string) => {
  try {
    const response = await api.post<ILoginResponse>(`/auth/signin/google`, { token });
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

export const registerWithGoogle = async (payload: IRegisterWithGooglePayload) => {
  try {
    const response = await api.post<IResponse<void>>(`/auth/register/google`, payload);
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

export const removePassword = async () => {
  try {
    await api.delete(`/auth/remove-password`);
  } catch (error) {
    throw error;
  }
};

export const removeGoogle = async () => {
  try {
    await api.delete(`/auth/remove-google`);
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (payload: IChangePasswordPayload) => {
  try {
    const response = await api.patch(`/auth/change-password`, payload);
    return response.data
  } catch (error) {
    throw error;
  }
};