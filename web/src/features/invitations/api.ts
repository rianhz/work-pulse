import { api } from "@/lib/axios";
import { IAcceptInvitePayload, IInviteUsersPayload } from "./interfaces";

export const inviteUsersApi = async (payload: IInviteUsersPayload) => {
  try {
    const response = await api.post("/invitations", payload);
    return response.data
  } catch (error) {
    throw error;
  }
}

export const verifyInviteTokenApi = async (token: string) => {
  try {
    const response = await api.get<{ email: string , tenantId: string }>(`/invitations/verify-token?token=${token}`);
    return response.data
  } catch (error) {
    throw error;
  }
}

export const acceptInviteApi = async (payload: IAcceptInvitePayload) => {
  try {
    const response = await api.post(`/invitations/accept`, payload);
    return response.data
  } catch (error) {
    throw error;
  }
}