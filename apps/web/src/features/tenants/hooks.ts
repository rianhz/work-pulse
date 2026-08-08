import { useMutation, useQuery } from "@tanstack/react-query";
import { getPublicTenantById, getTenantById, updateTenant } from "./api";
import { ITenant } from "./tenant";
import { toast } from "sonner";

export const useGetTenantById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => getTenantById(id || ''),
    enabled: !!id,
  });
};

export const useGetPublicTenantById = (id: string) => {
  return useQuery({
    queryKey: ['public-tenant', id],
    queryFn: () => getPublicTenantById(id),
    enabled: !!id,
  });
};

export const useUpdateTenant = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: Partial<ITenant> }) => updateTenant(id, payload),
    onSuccess: () => {
      toast.success('Changes saved successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update tenant');
    },
  });
};
