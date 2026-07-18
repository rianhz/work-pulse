'use client';
import EmblaCarousel from "@/components/carousel/BaseCarousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFeaturedAnnouncements } from "@/features/announcements/hooks";
import AnnouncementCard from "../card/AnnouncementCard";

export default function DashboardFeatured() {
    const { data: featuredAnnouncements, isLoading: isLoadingFeaturedAnnouncements } = useGetFeaturedAnnouncements();

  return (
    <>
      {isLoadingFeaturedAnnouncements && (
        <div className="space-y-4">
          {[...Array(1)].map((_, i) => (
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

      {featuredAnnouncements && featuredAnnouncements.length > 0 && (
        <EmblaCarousel options={{ loop: true, align: 'start' }} showArrowButton={false}>
          {featuredAnnouncements.map((item, index) => (
            <div className="h-[240px]" key={`featured-announcement-${index}`}>
              <AnnouncementCard announcement={item} isFeatured={true} className="h-full" lineClampBody={3} lineClampTitle={2} />
            </div>
          ))}
        </EmblaCarousel>
      )}
    </>
  )
}