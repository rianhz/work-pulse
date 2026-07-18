import { useMutation, useQuery } from "@tanstack/react-query";
import { createAnnouncement, deleteAnnouncement, getAnnouncementById, getAnnouncements, getFeaturedAnnouncements, updateAnnouncement } from "./api";
import { IAnnouncement } from "./announcements";
import { toast } from "sonner";
import { IPaginationQueryOptions } from "@/global";

export const useGetAnnouncements = (options: IPaginationQueryOptions) => {
  return useQuery({
    queryKey: ["announcements", options],
    queryFn: () => getAnnouncements(options),
  });
};

export const useGetFeaturedAnnouncements = () => {
  return useQuery({
    queryKey: ["featured-announcements"],
    queryFn: () => getFeaturedAnnouncements(),
  });
};

export const useGetAnnouncementById = (id: string) => {
  return useQuery({
    queryKey: ["announcements", id],
    queryFn: () => getAnnouncementById(id),
  });
};

export const useCreateAnnouncement = () => {
  return useMutation({
    mutationFn: (announcement: Partial<IAnnouncement>) => createAnnouncement(announcement),
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