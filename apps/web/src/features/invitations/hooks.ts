import { useMutation, useQuery } from "@tanstack/react-query";
import { IAcceptInvitePayload, IInviteUsersPayload } from "./interfaces";
import { acceptInviteApi, inviteUsersApi, verifyInviteTokenApi } from "./api";
import { toast } from "sonner";

export const useInviteUsers = () => {
  return useMutation({
    mutationFn: (payload: IInviteUsersPayload) => inviteUsersApi(payload),
    onSuccess: (data) => {
      toast.success("Users invited successfully");
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || "Failed to invite users");
    },
  });
}

export const useVerifyInviteToken = (token: string) => {
  return useQuery({
    queryKey: ["verify-invite-token", token],
    queryFn: () => verifyInviteTokenApi(token),
    enabled: !!token,
  });
}

export const useAcceptInvite = () => {
  return useMutation({
    mutationFn: (payload: IAcceptInvitePayload) => acceptInviteApi(payload),
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || "Failed to accept invitation");
    },
  });
}