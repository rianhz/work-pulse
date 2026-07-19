import { BaseEditor } from "@/components/tiptap/base/BaseEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IAnnouncement } from "@/features/announcements/announcements";
import { baseDateFormatFromNow, baseDateTimeFormat } from "@/lib/date-format";
import { ArrowRight, ChevronRightIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AnnouncementCard({ announcement, isFeatured = false, className="", lineClampBody, lineClampTitle }: { announcement: IAnnouncement, isFeatured?: boolean, className?: string, lineClampBody?: number, lineClampTitle?: number }) {
  const router = useRouter();
  const handleAnnouncementClick = (announcementId: string) => {
    router.push(`/announcements/${announcementId}`);
  }
  return (
    <div className={`flex flex-col gap-1 cursor-pointer ${className}`} onClick={() => handleAnnouncementClick(announcement._id)}>
      <div className="flex items-center justify-between w-full gap-2">
       
          <div className="flex items-center justify-between flex-1 gap-2">
            {isFeatured && 
              <Badge variant="primaryForeground" className="uppercase text-sm"><SparklesIcon fill="currentColor" className="size-4 text-primary/90" /> Featured</Badge>
            }
            {announcement.labelText && 
              <Badge color={announcement.labelColor} className="uppercase text-sm">{announcement.labelText}</Badge>
            }
            {isFeatured && <span className="ml-auto! text-xs text-muted-foreground">{baseDateFormatFromNow(announcement.publishedAt)}</span>}
          </div>
      </div>
      <div>
        <BaseEditor initialContent={announcement.title} isEditable={false} className="w-full" isTitle={true} lineClamp={lineClampTitle}/>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {announcement.content && 
          <div className="flex-1">
            <BaseEditor initialContent={announcement.content} isEditable={false} className="w-full" lineClamp={lineClampBody} />
          </div>
        }
        {!isFeatured && <span className="ml-auto! text-xs text-muted-foreground">{baseDateFormatFromNow(announcement.publishedAt)}</span>}
        {isFeatured && 
          <Link href={`/announcements/${announcement._id}`} className="ml-auto! flex items-center gap-0.5 text-primary">
            Read full release <ArrowRight fill="currentColor" className="size-4 text-primary" />
          </Link>
        }
      </div>
    </div>
  )
}