import { useMutation, useQuery } from "@tanstack/react-query";
import { approveLeaveRequest, createLeaveRequest, getLeaveApprovals, getLeaveRequestById, getMyLeaveBalance, getMyLeaveRequests, rejectLeaveRequest } from "./api";
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
    queryKey: ['my-leave-requests', options],
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

export const useRejectLeaveRequest = () => {
  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) => rejectLeaveRequest(id, rejectionReason),
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || "Failed to reject leave request");
    },
  });
}

export const useApproveLeaveRequest = () => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => approveLeaveRequest(id),
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || "Failed to approve leave request");
    },
  });
}