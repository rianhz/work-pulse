import { api } from "@/lib/axios";
import { IGetPaginatedResponse, IPaginationQueryOptions } from "@/global";
import { INotification } from "./notification";

export const getNotifications = async (options: IPaginationQueryOptions) => {
  const response = await api.get<IGetPaginatedResponse<INotification[]>>("/notifications", { params: options });
  return response.data;
};

export const getUnreadNotificationsCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return response.data;
};

export const markNotificationAsRead = async (id: string) => {
  const response = await api.post(`/notifications/mark-as-read/${id}`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.post("/notifications/mark-all-as-read");
  return response.data;
};