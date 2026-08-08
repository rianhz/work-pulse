import { IGetPaginatedResponse, IPaginationQueryOptions, IResponse } from "@/global";
import { IAnnouncement } from "./announcements";
import { api } from "@/lib/axios";

export const getAnnouncements = async (options: IPaginationQueryOptions) => {
  const response = await api.get<IGetPaginatedResponse<IAnnouncement[]>>("/announcements", { params: options });
  return response.data;
};

export const getFeaturedAnnouncements = async () => {
  const response = await api.get<IResponse<IAnnouncement[]>>("/announcements/featured");
  return response.data.data;
};

export const getAnnouncementById = async (id: string): Promise<IAnnouncement> => {
  const response = await api.get<IAnnouncement>(`/announcements/${id}`);
  return response.data;
};

export const createAnnouncement = async (announcement: Partial<IAnnouncement>) => {
  const response = await api.post("/announcements", announcement);
  return response.data;
};

export const updateAnnouncement = async (id: string, announcement: IAnnouncement) => {
  const response = await api.put(`/announcements/${id}`, announcement);
  return response.data;
};

export const deleteAnnouncement = async (id: string) => {
  const response = await api.delete(`/announcements/${id}`);
  return response.data;
};