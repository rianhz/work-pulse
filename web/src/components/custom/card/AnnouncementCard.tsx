import { BaseEditor } from "@/components/tiptap/base/BaseEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IAnnouncement } from "@/features/announcements/announcements";
import { baseDateFormatFromNow, baseDateTimeFormat } from "@/lib/date-format";
import { ArrowRight, ChevronRightIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AnnouncementCard({ announcement, isFeatured = false, className, lineClampBody, lineClampTitle }: { announcement: IAnnouncement, isFeatured?: boolean, className?: string, lineClampBody?: number, lineClampTitle?: number }) {
  const router = useRouter();
  const handleAnnouncementClick = (announcementId: string) => {
    router.push(`/announcements/${announcementId}`);
  }
  return (
    <Card className={`transition-all hover:shadow-md gap-1 cursor-pointer m-2 ${className}`} onClick={() => handleAnnouncementClick(announcement._id)}>
      <CardHeader>
        {isFeatured && 
        
        <div className="flex items-center justify-between gap-2">
          <Badge variant="primaryForeground" className="uppercase text-sm mb-2"><SparklesIcon fill="currentColor" className="size-4 text-primary/90" /> Featured</Badge>
          <span className="ml-auto! text-xs text-muted-foreground">{baseDateFormatFromNow(announcement.publishedAt)}</span>
        </div>
        }
        <CardTitle>
          <BaseEditor initialContent={announcement.title} isEditable={false} className="w-full" isTitle={true} lineClamp={lineClampTitle}/>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-between items-start gap-2">
        {announcement.content && <BaseEditor initialContent={announcement.content} isEditable={false} className="w-full" lineClamp={lineClampBody} />}
        {!isFeatured && <span className="ml-auto! text-xs text-muted-foreground">{baseDateFormatFromNow(announcement.publishedAt)}</span>}
        {isFeatured && 
          <Link href={`/announcements/${announcement._id}`} className="ml-auto! flex items-center gap-1 text-primary">
            Read full release <ArrowRight fill="currentColor" className="size-4 text-primary" />
          </Link>
        }
      </CardContent>
    </Card>
  )
}