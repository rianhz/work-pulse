import { useMutation, useQuery } from "@tanstack/react-query";
import { createLeaveRequest, getLeaveApprovals, getLeaveRequestById, getMyLeaveBalance, getMyLeaveRequests } from "./api";
import { toast } from "sonner";
import { IPaginationQueryOptions } from "@/global";

export const useMyLeaveBalance = () => {
  return useQuery({
    queryKey: ['my-leave-balance'],
    queryFn: getMyLeaveBalance,
  });
}

export const useMyLeaveRequests = (options: IPaginationQueryOptions) => {
  return useQuery({
    queryKey: ['my-leave-requests'],
    queryFn: () => getMyLeaveRequests(options),
  });
}

export const useCreateLeaveRequest = () => {
  return useMutation({
    mutationFn: createLeaveRequest,
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || "Failed to create leave request");
    },
  });
}

export const useLeaveApprovals = (options: IPaginationQueryOptions) => {
  return useQuery({
    queryKey: ['leave-approvals'],
    queryFn: () => getLeaveApprovals(options),
  });
}

export const useLeaveRequestById = (id: string) => {
  return useQuery({
    queryKey: ['leave-request-by-id', id],
    queryFn: () => getLeaveRequestById(id),
    enabled: !!id,
  });
}