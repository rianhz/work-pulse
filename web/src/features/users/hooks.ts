import { useQuery } from "@tanstack/react-query";
import { getMe } from "./api";

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
