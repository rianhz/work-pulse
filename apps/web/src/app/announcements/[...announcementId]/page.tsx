"use client";
import { BaseCover } from "@/components/custom/images/BaseCover";
import { BaseEditor } from "@/components/tiptap/base/BaseEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IAnnouncement } from "@/features/announcements/announcements";
import { useGetAnnouncementById, useUpdateAnnouncement } from "@/features/announcements/hooks";
import { ANNOUNCEMENT_TYPE_OFFICE, DEFAULT_COVER_PLACEHOLDER_IMAGE } from "@/helpers/constants";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnnouncementFormValues, announcementSchema } from "@/features/announcements/validator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks/hooks";
import { RootState } from "@/store";
import { NotAuthorised } from "@/components/custom/errors-and-empty/NotAuthorised";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, SaveIcon } from "lucide-react";
import EditConfirm from "@/components/custom/popup/EditConfirm";
import { Badge, BadgeVariant } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColorPicker } from "@/components/ui/color-picker";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function AnnouncementDetailPage() {
  const [showEditConfirmPopup, setShowEditConfirmPopup] = useState(false); 
  const [showLabelDialog, setShowLabelDialog] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { announcementId } = useParams();
  const mode = useSearchParams().get("mode");
  const isEditing = mode === "edit";

  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [tempLabelText, setTempLabelText] = useState('');
  const [tempLabelColor, setTempLabelColor] = useState('');

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
      labelText: announcement?.labelText || '',
      labelColor: announcement?.labelColor || '',
    }), [announcement])
  });

  const cover = watch("cover");
  const labelText = watch("labelText");
  const labelColor = watch("labelColor");

  const handleSave = () => {
    const payload = getValues() as IAnnouncement;
    console.log(payload);
    
    updateAnnouncement({ id: announcementId as string, announcement: { ...payload, status: 'draft' } as IAnnouncement }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["announcements", announcementId] });
        reset({
          title: payload.title,
          content: payload.content,
          cover: payload.cover,
          type: payload.type,
          labelText: payload.labelText,
          labelColor: payload.labelColor,
        }, {
          keepDirtyValues: false,
        })
        toast.success("Announcement updated successfully");
      },
    });
  }

  const handleTogglePreview = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("mode", params.get("mode") === "edit" ? "view" : "edit");
    router.push(`/announcements/${announcementId}?${params.toString()}`);
  }
 
  const handleConfirmEdit = () => {
    if(announcement?.status === 'draft') return;
    updateAnnouncement({ id: announcementId as string, announcement: { status: 'draft' } as IAnnouncement }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["announcements", announcementId] });
        setShowEditConfirmPopup(false);
      },
    });
  }

  const handleCancelEdit = () => {
    setShowEditConfirmPopup(false);
    
    const params = new URLSearchParams(window.location.search);
    params.set("mode", "view");
    
    router.replace(`/announcements/${announcementId}?${params.toString()}`);
  };

  const handleOpenLabelDialog = (type: 'add' | 'edit') => {
    if (type === 'edit') {
      setIsEditingLabel(true);
    } else {
      setIsEditingLabel(false);
    }
    setTempLabelText(getValues('labelText') || '');
    setTempLabelColor(getValues('labelColor') || '#000000');
    setShowLabelDialog(true);
  }

  const handleSaveLabel = () => {
    setValue('labelText', tempLabelText, { shouldDirty: true });
    setValue('labelColor', tempLabelColor, { shouldDirty: true });
    setTempLabelText('');
    setTempLabelColor('#000000');
    setShowLabelDialog(false);
  }

  const handleDeleteLabel = () => {
    setValue('labelText', '', { shouldDirty: true });
    setValue('labelColor', '#000000', { shouldDirty: true });
  }

  useEffect(() => {
    if (!announcementId) return;
    if (!isEditing) return;

    if (announcement?.status === 'published' && isAllowedToEdit) {
      const skip = localStorage.getItem(`announcement-edit-dialog-hidden-${announcementId}`) === "true";

      if (skip) {
        setShowEditConfirmPopup(false);
        return;
      }

      setShowEditConfirmPopup(true);
    }
    
  }, [announcement, announcementId, isEditing]);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-2 px-2">
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if(isEditing && !isAllowedToEdit) {
    return <NotAuthorised />;
  }

  return (
    <>
    <EditConfirm
      announcementId={announcementId as string}
      open={showEditConfirmPopup}
      setOpen={(isOpen) => {
        if (!isOpen) {
          handleCancelEdit();
        }
        setShowEditConfirmPopup(isOpen);
      }}
      confirm={handleConfirmEdit}
      isLoading={isPendingUpdateAnnouncement}
    />
    <Dialog open={showLabelDialog} onOpenChange={setShowLabelDialog}>
      <DialogContent className="max-w-md">
        <DialogTitle>{isEditingLabel ? 'Edit Label' : 'Add Label'}</DialogTitle>
        <div className="flex flex-col items-center gap-2">
          <Badge color={tempLabelColor || '#000000'}>{tempLabelText || 'Label'}</Badge>
          <Input type="text" placeholder="Example: New Feature, Important, etc." value={tempLabelText} onChange={(e) => setTempLabelText(e.target.value)} />
          <ColorPicker
            value={tempLabelColor}
            onChange={(color) => setTempLabelColor(color)}
          />
          <div className="flex items-center justify-end gap-2 mt-4 w-full">
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setShowLabelDialog(false)}>Cancel</Button>
            <Button type="button" onClick={handleSaveLabel}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <form className="w-full relative pb-20" onSubmit={handleSubmit(handleSave)}>
      {isEditing && 
        <div className="flex justify-end flex-1">
          <Badge variant={announcement?.status as BadgeVariant} className="text-xs ml-auto">{announcement && announcement?.status.charAt(0).toUpperCase() + announcement?.status.slice(1)}</Badge>
        </div>
      }
      <Card className="p-0 mt-2">
        <CardHeader className="p-0">
          <CardTitle>
            <div className="w-full rounded-t-lg relative">
              {cover && 
                <Controller 
                  control={control} 
                  name="cover" 
                  render={({ field: { onChange, value } }) => (
                  <BaseCover src={value} alt="Organization banner" isEditable={isEditing} folderName="company-banners" onUploadSuccess={(url) => onChange(url)} onDeleteSuccess={() => onChange('')}  />
                )} />
              }
            </div>
            <div className="mt-2 flex justify-between px-2 items-center gap-2">
              {labelText && <Badge color={labelColor} className="text-xs">{labelText}</Badge>}
              {isEditing && 
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="group">
                      <Button variant="outline" size="xs">Atrributes <ChevronDownIcon className="w-4 h-4 group-data-[state=open]:rotate-180 transition-transform duration-200" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!cover && isEditing && 
                        <DropdownMenuItem onClick={() => setValue('cover', DEFAULT_COVER_PLACEHOLDER_IMAGE, { shouldDirty: true })}>
                            Set Cover
                        </DropdownMenuItem>
                      }
                      {!labelText && 
                        <DropdownMenuItem onClick={() => handleOpenLabelDialog('add')}>
                          Add Label
                        </DropdownMenuItem>
                      }
                      {labelText && 
                        <DropdownMenuItem onClick={() => handleOpenLabelDialog('edit')}>
                          Edit Label
                        </DropdownMenuItem>
                      }
                      {labelText && 
                        <DropdownMenuItem onClick={handleDeleteLabel}>
                          Delete Label
                        </DropdownMenuItem>
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="xs" onClick={handleTogglePreview} type="button">
                    Preview
                  </Button>
                </div>
              }
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
              >
                Back editing
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
    </>
  );
}