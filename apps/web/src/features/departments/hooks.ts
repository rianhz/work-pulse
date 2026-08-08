import { useMutation, useQuery } from "@tanstack/react-query";
import { createDepartment, deleteDepartment, disableDepartment, enableDepartment, getDepartment, getDepartments, updateDepartment } from "./api";
import { DepartmentSchema } from "./validator";
import { toast } from "sonner";

export const useCreateDepartment = () => {
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      toast.success('Department created successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to create department');
    },
  });
};

export const useGetDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
};

export const useGetDepartment = (id: string) => {
  return useQuery({
    queryKey: ['department', id],
    queryFn: () => getDepartment(id),
    enabled: !!id,
  });
};

export const useUpdateDepartment = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: DepartmentSchema }) => updateDepartment(id, data),
    onSuccess: () => {
      toast.success('Department updated successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update department');
    },
  });
};

export const useDeleteDepartment = () => {
  return useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: () => {
      toast.success('Department deleted successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to delete department');
    },
  });
};

export const useDisableDepartment = () => {
  return useMutation({
    mutationFn: (id: string) => disableDepartment(id),
    onSuccess: () => {
      toast.success('Department disabled successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to disable department');
    },
  });
};

export const useEnableDepartment = () => {
  return useMutation({
    mutationFn: (id: string) => enableDepartment(id),
    onSuccess: () => {
      toast.success('Department enabled successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to enable department');
    },
  });
};