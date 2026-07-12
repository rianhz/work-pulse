import { IGetPaginatedResponse, IPaginationQueryOptions } from "@/global";
import { api } from "@/lib/axios";
import { IAnnouncement } from "../announcements/announcements";

export const getDashboardAnnouncements = async (options: IPaginationQueryOptions) => {
  const response = await api.get<IGetPaginatedResponse<IAnnouncement[]>>(`/dashboard`, {
    params: options,
  });
  return response.data
}