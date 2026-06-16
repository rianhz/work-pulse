import { useMutation, useQuery } from "@tanstack/react-query";
import { getTenantById, updateTenant } from "./api";
import { ITenant } from "./tenant";
import { toast } from "sonner";

export const useGetTenantById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => getTenantById(id || ''),
    enabled: !!id,
  });
};

export const useUpdateTenant = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: Partial<ITenant> }) => updateTenant(id, payload),
    onSuccess: () => {
      toast.success('Tenant updated successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update tenant');
    },
  });
};

export const useUpdateLogo = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: Partial<ITenant> }) => updateTenant(id, payload),
    onSuccess: () => {
      toast.success('Logo updated successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update logo');
    },
  });
};

export const useUpdateFullName = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: Partial<ITenant> }) => updateTenant(id, payload),
    onSuccess: () => {
      toast.success('Full name updated successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update full name');
    },
  });
};

export const useUpdateSlug = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: Partial<ITenant> }) => updateTenant(id, payload),
    onSuccess: () => {
      toast.success('Slug updated successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update slug');
    },
  });
};

export const useUpdateDescription = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: Partial<ITenant> }) => updateTenant(id, payload),
    onSuccess: () => {
      toast.success('Description updated successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update description');
    },
  });
};