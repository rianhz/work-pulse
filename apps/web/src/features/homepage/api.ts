import { IGetPaginatedResponse, IPaginationQueryOptions } from "@/global";
import { api } from "@/lib/axios";
import { IAnnouncement } from "../announcements/announcements";

export const getHomeAnnouncements = async (options: IPaginationQueryOptions) => {
  const response = await api.get<IGetPaginatedResponse<IAnnouncement[]>>(`/home`, {
    params: options,
  });
  return response.data
}