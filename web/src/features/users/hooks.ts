import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, getMeProviders, getUsers, updateUser } from "./api";
import { toast } from "sonner";
import { IGetPaginatedResponse, IPaginationQueryOptions } from "@/global";
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

export const useGetUsers = (params: IPaginationQueryOptions) => {
  return useQuery<IGetPaginatedResponse<IUser[]>>({
    queryKey: ["users", params],
    queryFn: async () => {
      try {
        const response = await getUsers(params);
        return response;
      } catch (error) {
        throw error;
      }
    },
  });
};