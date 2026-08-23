import { useMutation, useQuery } from "@tanstack/react-query";
import { getTenantSettings, updateTenantSettings } from "./api";
import { toast } from "sonner";
import { ITenantSettings } from "./tenantSettings";

export const useGetTenantSettings = (id: string | undefined, isModerator: boolean = false) => {
  return useQuery({
    queryKey: ['tenant-settings', id, isModerator],
    queryFn: () => getTenantSettings(id || ''),
    enabled: !!id && isModerator,
  });
};

export const useUpdateTenantSettings = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: Partial<ITenantSettings> }) => updateTenantSettings(id, payload),
    onSuccess: () => {
      toast.success('Changes saved successfully');
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update tenant');
    },
  });
};
