'use client';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AnnouncementCard from "../card/AnnouncementCard";
import { useInView } from "react-intersection-observer";
import { useGetDashboardAnnouncements } from "@/features/dashboard/hooks";
import { useEffect, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardAnnouncements() {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const limit = 10;

  const { data: dashboardAnnouncements, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetDashboardAnnouncements({ search: "", limit });

  const announcements = useMemo(() => 
    dashboardAnnouncements?.pages.flatMap((page) => page.data) || [], 
    [dashboardAnnouncements]
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <Card className="grid gap-4 mt-2 p-4">
      {isLoading && (
        <div className="flex flex-col gap-2 p-2">
          {[...Array(limit)].map((_, i) => (
            <div key={`skeleton-${i}`}>
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )}

      {announcements.map((item, index) => (
        <AnnouncementCard key={`announcement-${index}`} announcement={item} lineClampBody={3} lineClampTitle={2} />
      ))}

      <div ref={ref} className="h-12 w-full flex items-center justify-center">
        {isFetchingNextPage && <Spinner className="size-6" />}
      </div>
    </Card>
  )
}