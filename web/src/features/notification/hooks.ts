import { QueryOptions, useQuery } from "@tanstack/react-query";
import { getNotifications, getUnreadNotificationsCount } from "./api";
import { INotification } from "./notification";
import { IGetPaginatedResponse, IPaginationQueryOptions } from "@/global";

export const useNotification = (options: IPaginationQueryOptions) => {
  const query = useQuery<IGetPaginatedResponse<INotification[]>>({
    queryKey: ["notifications"],
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