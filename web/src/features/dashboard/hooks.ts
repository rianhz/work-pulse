import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getDashboardAnnouncements } from "./api";
import { IPaginationQueryOptions } from "@/global";

export const useGetDashboardAnnouncements = (options: IPaginationQueryOptions) => {
  return useInfiniteQuery({
    queryKey: ["dashboard", options],
    initialPageParam: 1, 
    
    queryFn: ({ pageParam = 1 }) => 
      getDashboardAnnouncements({
        ...options,
        page: pageParam,
      }),
      
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.pagination?.hasNextPage) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
  });
}