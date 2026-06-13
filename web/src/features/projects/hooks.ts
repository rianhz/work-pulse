import { getProjectsByBulkIds } from "./api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetProjectsByBulkIds = () => {
  return useMutation({
    mutationFn: (ids: string[]) => getProjectsByBulkIds(ids),
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};