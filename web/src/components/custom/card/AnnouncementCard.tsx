import { Activity } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BaseEditor } from "@/components/tiptap/base/BaseEditor";
import { Badge } from "@/components/ui/badge";
import { IAnnouncement } from "@/features/announcements/announcements";
import { baseDateFormatFromNow } from "@/lib/date-format";
import { ArrowRight, SparklesIcon } from "lucide-react";

export default function AnnouncementCard({ announcement, isFeatured = false, className="", lineClampBody, lineClampTitle }: { announcement: IAnnouncement, isFeatured?: boolean, className?: string, lineClampBody?: number, lineClampTitle?: number }) {
  const router = useRouter();
  const handleAnnouncementClick = (announcementId: string) => {
    router.push(`/announcements/${announcementId}`);
  }
  return (
    <div className={`flex flex-col gap-1 cursor-pointer ${className}`} onClick={() => handleAnnouncementClick(announcement._id)}>
      <div className="flex items-center justify-between w-full gap-2">
       
          <div className="flex items-center justify-between flex-1 gap-2 mb-3">
            <Activity mode={isFeatured ? "visible" : "hidden"}>
              <Badge variant="primaryForeground" className="text-sm flex"><SparklesIcon fill="currentColor" className="text-primary/90" /> Featured</Badge>
            </Activity>
            <Activity mode={announcement.labelText ? "visible" : "hidden"}>
              <Badge color={announcement.labelColor} className="text-sm ">{announcement.labelText}</Badge>
            </Activity>
            <Activity mode={isFeatured ? "visible" : "hidden"}>
              <span className="ml-auto! text-xs text-muted-foreground">{baseDateFormatFromNow(announcement.publishedAt)}</span>
            </Activity>
          </div>
      </div>
      <div>
        <BaseEditor initialContent={announcement.title} isEditable={false} className="w-full" isTitle={true} lineClamp={lineClampTitle}/>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <Activity mode={announcement.content ? "visible" : "hidden"}>
          <div className="flex-1">
            <BaseEditor initialContent={announcement.content} isEditable={false} className="w-full" lineClamp={lineClampBody} />
          </div>
        </Activity>
        <Activity mode={!isFeatured ? "visible" : "hidden"}>
          <span className="ml-auto! text-xs text-muted-foreground">{baseDateFormatFromNow(announcement.publishedAt)}</span>
        </Activity>
        <Activity mode={isFeatured ? "visible" : "hidden"}>
          <Link href={`/announcements/${announcement._id}`} className="ml-auto! flex items-center gap-0.5 text-primary">
            Read full release <ArrowRight fill="currentColor" className="size-4 text-primary" />
          </Link>
        </Activity>
      </div>
    </div>
  )
}