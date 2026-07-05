import { useMutation, useQuery } from "@tanstack/react-query";
import { createAnnouncement, deleteAnnouncement, getAnnouncementById, getAnnouncements, updateAnnouncement } from "./api";
import { IAnnouncement } from "./announcements";
import { toast } from "sonner";

export const useGetAnnouncements = () => {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
  });
};

export const useGetAnnouncementById = (id: string) => {
  return useQuery({
    queryKey: ["announcement", id],
    queryFn: () => getAnnouncementById(id),
    enabled: !!id,
  });
};

export const useCreateAnnouncement = () => {
  return useMutation({
    mutationFn: (announcement: IAnnouncement) => createAnnouncement(announcement),
    onSuccess: () => {
      toast.success("Announcement created successfully");
    },
    onError: (error) => {
      toast.error((error as any).response?.data?.message || (error as Error).message || "Failed to create announcement");
    },
  });
};

export const useUpdateAnnouncement = () => {
  return useMutation({
    mutationFn: ({ id, announcement }: { id: string, announcement: IAnnouncement }) => updateAnnouncement(id, announcement),
    onSuccess: () => {
      toast.success("Announcement updated successfully");
    },
    onError: (error) => {
      toast.error((error as any).response?.data?.message || (error as Error).message || "Failed to update announcement");
    },
  });
};

export const useDeleteAnnouncement = () => {
  return useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => {
      toast.success("Announcement deleted successfully");
    },
    onError: (error) => {
      toast.error((error as any).response?.data?.message || (error as Error).message || "Failed to delete announcement");
    },
  });
};