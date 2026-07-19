'use client';
import EmblaCarousel from "@/components/carousel/BaseCarousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFeaturedAnnouncements } from "@/features/announcements/hooks";
import AnnouncementCard from "../card/AnnouncementCard";

export default function DashboardFeatured() {
    const { data: featuredAnnouncements, isLoading: isLoadingFeaturedAnnouncements } = useGetFeaturedAnnouncements();

  return (
    <Card className="p-4">
      {isLoadingFeaturedAnnouncements && (
        <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-4 w-full" />
            </div>
        </div>
      )}

      {featuredAnnouncements && featuredAnnouncements.length > 0 && (
        <EmblaCarousel options={{ loop: true, align: 'start' }} showArrowButton={false}>
          {featuredAnnouncements.map((item, index) => (
            <div className="h-[210px]" key={`featured-announcement-${index}`}>
              <AnnouncementCard announcement={item} isFeatured={true} className="h-full" lineClampBody={5} lineClampTitle={2} />
            </div>
          ))}
        </EmblaCarousel>
      )}
    </Card>
  )
}