import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, getMeProviders, getUsers, updateUser } from "./api";
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
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string, payload: Partial<IUser> }) => updateUser(userId, payload),
    onSuccess: () => {
      toast.success('Changes saved successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update user');
    },
  });
};

export const useGetUsers = () => {
  return useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await getUsers();
        return response;
      } catch (error) {
        throw error;
      }
    },
  });
};