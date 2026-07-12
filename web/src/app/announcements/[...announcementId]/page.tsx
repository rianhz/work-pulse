"use client";
import BaseAvatar from "@/components/custom/images/BaseAvatar";
import { BaseCover } from "@/components/custom/images/BaseCover";
import { BaseEditor } from "@/components/tiptap/base/BaseEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { IAnnouncement } from "@/features/announcements/announcements";
import { useGetAnnouncementById, useUpdateAnnouncement } from "@/features/announcements/hooks";
import { ANNOUNCEMENT_TYPE_OFFICE } from "@/helpers/constants";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnnouncementFormValues, announcementSchema } from "@/features/announcements/validator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";

export default function AnnouncementDetailPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { announcementId } = useParams();
  const mode = useSearchParams().get("mode");
  const isEditing = mode === "edit";
  const { data: announcement, isLoading, isFetched } = useGetAnnouncementById(announcementId as string);
  const { mutate: updateAnnouncement, isPending: isPendingUpdateAnnouncement } = useUpdateAnnouncement();

  const [isVisible, setIsVisible] = useState(false);

  const { control, handleSubmit, formState: { errors }, getValues, reset, formState: { isDirty }, watch,
  setValue } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement?.title || '',
      content: announcement?.content || '',
      thumbnail: announcement?.thumbnail || '',
      cover: announcement?.cover || '',
      type: announcement?.type || ANNOUNCEMENT_TYPE_OFFICE,
      status: announcement?.status || 'draft' as const,
    },
  });

  const currentStatus = watch("status")

  const fallbackThumbnailImage = <Image src={'/thumbnail-default.svg'} alt="Avatar" className="w-[100px] h-[100px] rounded-full border border-1.5 border-border" width={100} height={100} />;

  const handleSave = () => {
    const payload = getValues() as IAnnouncement;
    console.log(payload);
    
    updateAnnouncement({ id: announcementId as string, announcement: payload }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["announcements", announcementId] });
        toast.success("Announcement updated successfully");
      },
    });
  }

  const handleToggleStatus = () => {
    const currentFormStatus = getValues("status");
    const newStatus = currentFormStatus === 'draft' ? 'published' : 'draft';
    updateAnnouncement({ id: announcementId as string, announcement: {
      status: newStatus,
    } as IAnnouncement }, {
      onSuccess: () => {
        setValue("status", newStatus, { shouldDirty: false })
        queryClient.invalidateQueries({ queryKey: ["announcements", announcementId] });
        toast.success("Announcement published successfully");
      },
    });
  }

  const handleTogglePreview = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("mode", params.get("mode") === "edit" ? "preview" : "edit");
    router.push(`/announcements/${announcementId}?${params.toString()}`);
  }

  useEffect(() => {
    if (!isDirty) {
      reset({
        title: announcement?.title || '',
        content: announcement?.content || '',
        thumbnail: announcement?.thumbnail || '',
        cover: announcement?.cover || '',
        type: announcement?.type || ANNOUNCEMENT_TYPE_OFFICE,
        status: announcement?.status || 'draft' as const,
      });
    }
    if (isFetched) {
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, [ announcement, reset, isFetched, isDirty ]);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-2 px-2">
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <form className="w-full relative pb-20">
      <Card className="p-0">
        <CardHeader className="p-0">
          <CardTitle>
            <div className="w-full h-60 rounded-t-lg relative">
              <Controller 
                control={control} 
                name="cover" 
                render={({ field: { onChange, value } }) => (
                <BaseCover src={value} alt="Organization banner" isEditable={isEditing} folderName="company-banners" onUploadSuccess={(url) => onChange(url)} onDeleteSuccess={() => onChange('')} />
              )} />
              <div className="absolute bottom-0 left-0 p-2">
                <Controller
                  control={control}
                  name="thumbnail"
                  render={({ field: { onChange, value } }) => (
                    <BaseAvatar src={value} alt="Avatar" fallbackImage={fallbackThumbnailImage} className="w-[100px] h-[100px] rounded-full" imageLoading="eager" isEditable={isEditing} onUploadSuccess={(url) => onChange(url)} />
                  )}
                />
              </div>
            </div>
            <div className="w-full flex items-center gap-2 mt-4 py-2">
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <Input type="text" disabled={!isEditing} placeholder="Announcement title" className="h-20 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border md:text-3xl disabled:opacity-100" value={value} onChange={(e) => onChange(e.target.value)} />
                )}
              />
            </div>
          </CardTitle>
          <CardContent>
            <Controller
              control={control}
              name="content"
              render={({ field: { onChange, value } }) => (
                <BaseEditor isEditable={isEditing} onChange={(content) => onChange(content)} initialContent={value || ''} />
              )}
            />
          </CardContent>
        </CardHeader>
      </Card>

    <div className={
      `fixed bottom-6 left-[calc(50%+var(--sidebar-width)/2)] -translate-x-1/2 z-50
      rounded-xl bg-card p-4 border border-border shadow-xl w-full max-w-2xl
      transition-all duration-500 ease-out
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
    `}>
        <div className="flex justify-between items-center gap-1">
          {isDirty && (
            <Button variant="outline" type="submit" onClick={handleSubmit(handleSave)} disabled={isPendingUpdateAnnouncement}>
              {isPendingUpdateAnnouncement ? <Spinner /> : 'Save'}
            </Button>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Button variant="secondary" onClick={handleTogglePreview} type="button">
              {isEditing ? 'Preview' : 'Edit'}
            </Button>
            <Button onClick={handleToggleStatus} disabled={isPendingUpdateAnnouncement} type="button">
              {isPendingUpdateAnnouncement ? <Spinner /> : currentStatus === 'draft' ? 'Publish' : 'Unpublish'}
            </Button>
          </div>
        </div>
    </div>
  </form>
  );
}