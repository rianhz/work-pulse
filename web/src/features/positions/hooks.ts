import { useMutation, useQuery } from "@tanstack/react-query";
import { createPosition, deletePosition, getPositionById, updatePosition, getPositions, enablePosition, disablePosition } from "./api";
import { IPosition } from "./positions";
import { toast } from "sonner";

export const useGetPositions = () => {
  return useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions(),
  });
}

export const useGetPositionById = (id: string) => {
  return useQuery({
    queryKey: ['position', id],
    queryFn: () => getPositionById(id),
  });
}

export const useCreatePosition = () => {
  return useMutation({
    mutationFn: (payload: {name: string }) => createPosition(payload),
  });
}

export const useUpdatePosition = () => {
  return useMutation({
    mutationFn: ({id, payload}: {id: string, payload: {name: string, status?: 'active' | 'disabled' | 'deleted' }}) => updatePosition(id, payload),
    onSuccess: () => {
      toast.success('Position updated successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update position');
    },
  });
}

export const useDeletePosition = () => {
  return useMutation({
    mutationFn: (id: string) => deletePosition(id),
    onSuccess: () => {
      toast.success('Position deleted successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to delete position');
    },
  });
}

export const useDisablePosition = () => {
  return useMutation({
    mutationFn: (id: string) => disablePosition(id),
    onSuccess: () => {
      toast.success('Position disabled successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to disable position');
    },
  });
}

export const useEnablePosition = () => {
  return useMutation({
    mutationFn: (id: string) => enablePosition(id),
    onSuccess: () => {
      toast.success('Position enabled successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to enable position');
    },
  });
}