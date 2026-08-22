import { useMutation, useQuery } from "@tanstack/react-query";
import { getNotifications, getUnreadNotificationsCount, markAllNotificationsAsRead, markNotificationAsRead } from "./api";
import { INotification } from "./notification";
import { IGetPaginatedResponse, IPaginationQueryOptions } from "@/global";

export const useNotification = (options: IPaginationQueryOptions) => {
  const query = useQuery<IGetPaginatedResponse<INotification[]>>({
    queryKey: ["notifications", options],
    queryFn: () => getNotifications(options),
  });
  return query;
};

export const useUnreadNotificationsCount = () => {
  const query = useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: () => getUnreadNotificationsCount(),
  });
  return query;
};

export const useMarkNotificationAsRead = () => {
  const mutation = useMutation({
    mutationFn: (ids: string[]) => markNotificationAsRead(ids),
  });
  return mutation;
};

export const useMarkAllNotificationsAsRead = () => {
  const mutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
  });
  return mutation;
};