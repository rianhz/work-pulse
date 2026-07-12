"use client";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardAnnouncements } from "@/features/dashboard/hooks";
import { baseDateTimeFormat } from "@/lib/date-format";
import { Spinner } from "@/components/ui/spinner";
import { BaseEditor } from "@/components/tiptap/base/BaseEditor";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const limit = 10;

  const { data: dashboardAnnouncements, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetDashboardAnnouncements({ search: "", limit });

  const announcements = useMemo(() => 
    dashboardAnnouncements?.pages.flatMap((page) => page.data) || [], 
    [dashboardAnnouncements]
  );

  const handleAnnouncementClick = (announcementId: string) => {
    router.push(`/announcements/${announcementId}`);
  }

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 px-1">
        {announcements.map((item, index) => (
          <Card key={`announcement-${index}`} className="transition-all hover:shadow-md gap-1 cursor-pointer" onClick={() => handleAnnouncementClick(item._id)}>
            <CardHeader>
              <CardTitle>
                <BaseEditor initialContent={item.title} isEditable={false} className="w-full" isTitle={true} />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-between items-start gap-1">
              {item.content && <BaseEditor initialContent={item.content} isEditable={false} className="w-full" />}
              <span className="ml-auto! text-xs text-muted-foreground">{baseDateTimeFormat(item.createdAt)}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(limit)].map((_, i) => (
            <Card key={`skeleton-${i}`}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div ref={ref} className="h-12 w-full flex items-center justify-center">
        {isFetchingNextPage && <Spinner className="size-6" />}
      </div>
    </div>
  );
}