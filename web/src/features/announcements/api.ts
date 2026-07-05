import { IAnnouncement } from "./announcements";
import { api } from "@/lib/axios";

export const getAnnouncements = async () => {
  const response = await api.get("/announcements");
  return response.data;
};

export const getAnnouncementById = async (id: string) => {
  const response = await api.get(`/announcements/${id}`);
  return response.data;
};

export const createAnnouncement = async (announcement: IAnnouncement) => {
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