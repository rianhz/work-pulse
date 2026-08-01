import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getHomeAnnouncements } from "./api";
import { IPaginationQueryOptions } from "@/global";

export const useGetHomeAnnouncements = (options: IPaginationQueryOptions) => {
  return useInfiniteQuery({
    queryKey: ["home", options],
    initialPageParam: 1, 
    
    queryFn: ({ pageParam = 1 }) => 
      getHomeAnnouncements({
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