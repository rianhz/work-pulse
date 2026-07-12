"use client";
import BaseAvatar from "@/components/custom/images/BaseAvatar";
import { BaseCover } from "@/components/custom/images/BaseCover";
import { BaseEditor } from "@/components/tiptap/base/BaseEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IAnnouncement } from "@/features/announcements/announcements";
import { useGetAnnouncementById, useUpdateAnnouncement } from "@/features/announcements/hooks";
import { ANNOUNCEMENT_TYPE_OFFICE, DEFAULT_COVER_IMAGE, DEFAULT_THUMBNAIL_IMAGE } from "@/helpers/constants";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnnouncementFormValues, announcementSchema } from "@/features/announcements/validator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks/hooks";
import { RootState } from "@/store";
import { NotAuthorised } from "@/components/custom/errors-and-empty/NotAuthorised";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, SaveIcon } from "lucide-react";

export default function AnnouncementDetailPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { announcementId } = useParams();
  const mode = useSearchParams().get("mode");
  const isEditing = mode === "edit";

  const currentUserRole = useAppSelector((state: RootState) => state.currentUser.user?.role);
  const isMods = ["admin", "owner"];
  const isAllowedToEdit = useMemo(() => isMods.includes(currentUserRole as string ?? ''), [currentUserRole]);

  const { data: announcement, isLoading } = useGetAnnouncementById(announcementId as string);
  const { mutate: updateAnnouncement, isPending: isPendingUpdateAnnouncement } = useUpdateAnnouncement();

  const { control, handleSubmit, formState: { errors }, getValues, reset, formState: { isDirty }, watch, setValue } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    values: useMemo(() => ({
      title: announcement?.title || '',
      content: announcement?.content || '',
      cover: announcement?.cover || '',
      type: announcement?.type || ANNOUNCEMENT_TYPE_OFFICE,
      status: announcement?.status || 'draft' as const,
    }), [announcement])
  });

  const cover = watch("cover");

  const handleSave = () => {
    const payload = getValues() as IAnnouncement;
    
    updateAnnouncement({ id: announcementId as string, announcement: payload }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["announcements", announcementId] });
        reset({
          title: payload.title,
          content: payload.content,
          cover: payload.cover,
          type: payload.type,
          status: payload.status,
        }, {
          keepDirtyValues: false,
        })
        toast.success("Announcement updated successfully");
      },
    });
  }

  const handleTogglePreview = () => {
    console.log("handleTogglePreview");
    console.log(getValues());
    const params = new URLSearchParams(window.location.search);
    params.set("mode", params.get("mode") === "edit" ? "view" : "edit");
    router.push(`/announcements/${announcementId}?${params.toString()}`);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-2 px-2">
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!isAllowedToEdit && isEditing) {
    return <NotAuthorised />;
  }

  return (
    <form className="w-full relative pb-20" onSubmit={handleSubmit(handleSave)}>
      <Card className="p-0">
        <CardHeader className="p-0">
          <CardTitle>
            <div className={cn("w-full rounded-t-lg relative", )}>
              {cover && 
                <Controller 
                  control={control} 
                  name="cover" 
                  render={({ field: { onChange, value } }) => (
                  <BaseCover src={value} alt="Organization banner" isEditable={isEditing} folderName="company-banners" onUploadSuccess={(url) => onChange(url)} onDeleteSuccess={() => onChange('')}  />
                )} />
              }
            </div>
            <div className="mt-4 flex justify-end px-2">
              {!cover && isEditing && <Button variant="secondary" type="button" size="xs" onClick={() => setValue("cover", DEFAULT_COVER_IMAGE, { shouldDirty: true })}>
                Set Cover
              </Button>}
              {isEditing && <Button variant="secondary" size="xs" onClick={handleTogglePreview} type="button">
                Preview
              </Button>}

            </div>
            <div className="w-full flex flex-col flex-start gap-2 p-2">
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <BaseEditor isEditable={isEditing} onChange={(content) => onChange(content)} initialContent={value || ''} showToolbar={false} className="w-full" isTitle={true} />
                )}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
          </CardTitle>
          <CardContent className="pb-8 px-2">
            <Controller
              control={control}
              name="content"
              render={({ field: { onChange, value } }) => (
                <BaseEditor isEditable={isEditing} onChange={(content) => onChange(content)} initialContent={value || ''} className={`${isEditing ? "min-h-48" : ""}`} />
              )}
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
          </CardContent>
        </CardHeader>
      </Card>

      <AnimatePresence mode="wait">
        {isAllowedToEdit && (
          mode === "view" ? (
            <motion.div
              key="view-actions"
              initial={{ opacity: 0, y: 30, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 30, x: "-50%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed bottom-6 left-[calc(50%+var(--sidebar-width)/2)] z-50"
            >
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={handleTogglePreview} 
                type="button" 
                className="min-w-[90px]" 
                icon={ChevronLeftIcon} 
                iconPosition="left"
              >
                Back to edit
              </Button>
            </motion.div>
          ) : isDirty && isEditing ? (
            <motion.div
              key="edit-actions"
              initial={{ opacity: 0, y: 30, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 30, x: "-50%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed bottom-6 left-[calc(50%+var(--sidebar-width)/2)] z-50"
            >
              <Button 
                size="lg" 
                type="submit" 
                disabled={isPendingUpdateAnnouncement} 
                loading={isPendingUpdateAnnouncement} 
                className="min-w-[90px]" 
                icon={SaveIcon} 
                iconPosition="left"
              >
                Save
              </Button>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </form>
  );
}