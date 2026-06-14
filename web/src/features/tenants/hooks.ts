import { useQuery } from "@tanstack/react-query";
import { getTenantById } from "./api";

export const useGetTenantById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => getTenantById(id || ''),
    enabled: !!id,
  });
};