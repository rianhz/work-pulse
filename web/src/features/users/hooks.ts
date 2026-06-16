import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, getMeProviders, updateUser } from "./api";
import { toast } from "sonner";
import { IResponse } from "@/global";
import { IUser } from "./users";

export const useGetMe = () => {
  return useQuery<any>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const response = await getMe();
        return response;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });
};

export const useGetMeProviders = () => {
  return useQuery<('password' | 'google')[]>({
    queryKey: ["providers"],
    queryFn: async () => {
      try {
        const response = await getMeProviders();
        return response;
      } catch (error) {
        throw error;
      }
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<IUser>) => updateUser(payload),
    onSuccess: (data: IResponse<void>) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useUpdateAvatar = () => {
  return useMutation({
    mutationFn: (payload: { avatar: string }) => updateUser({ avatar: payload.avatar }),
    onSuccess: (data: IResponse<void>) => {
      toast.success(data.message);
    },
    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useUpdateFullName = () => {
  return useMutation({
    mutationFn: (payload: { fullName: string }) => updateUser({ fullName: payload.fullName }),
    onSuccess: (data: IResponse<void>) => {
      toast.success(data.message);
    },
    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};