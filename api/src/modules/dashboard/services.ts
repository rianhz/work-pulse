import { isHaveAccess } from "../../utils/casl";
import { AnnouncementModel } from "../announcements/schema";
import { AuthUser } from "../authentication/interfaces";
import { QueryOptions } from "../global";

export const getDashboardAnnouncementsService = async (authenticatedUser: AuthUser, options: QueryOptions) => {
  const tenantId = authenticatedUser.tenantId

  const { search, page, limit } = options;
  await isHaveAccess(authenticatedUser, null, "Announcement", "read");
  const skip = (page - 1) * limit;

  const baseQuery:any = {
    tenantId,
    status: "published" 
  };
  if (search) {
    baseQuery.title = { $regex: search, $options: "i" };
  }

  const data = await AnnouncementModel.find(baseQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .populate("createdBy", "nickName fullName")
    .populate("lastUpdatedBy", "nickName fullName")
    .select("-__v -tenantId")
    .limit(limit)
    .lean({ virtuals: true });

  const totalItems = await AnnouncementModel.countDocuments(baseQuery);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages
    }
  };
};