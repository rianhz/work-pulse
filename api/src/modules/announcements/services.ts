import { isHaveAccess } from "../../utils/casl";
import { AuthUser } from "../authentication/interfaces";
import { QueryOptions } from "../global";
import { IAnnouncement } from "./interfaces";
import { AnnouncementModel } from "./schema";
  
export const createAnnouncementService = async (authenticatedUser: AuthUser, announcement: Partial<IAnnouncement>) => {
 await isHaveAccess(authenticatedUser, null, "Announcement", "manage");

  const payload = {
    ...announcement,
    createdBy: authenticatedUser.userId,
    lastUpdatedBy: authenticatedUser.userId,
  }

  await AnnouncementModel.validate(payload);
  const newAnnouncement = await AnnouncementModel.create(payload);
  return newAnnouncement;
};

export const getAnnouncementsService = async (authenticatedUser: AuthUser, options: QueryOptions):Promise<{ data: IAnnouncement[], total: number }> => {
  const { search, page, limit } = options;
  const tenantId = authenticatedUser.tenantId
  await isHaveAccess(authenticatedUser, null, "Announcement", "read");

  const skip = (page - 1) * limit;
  const baseQuery: any = {
    tenantId,
    status: { $ne: "deleted" },
  };  
  if (search) {
    baseQuery.title = { $regex: search, $options: "i" };
  }
  const announcements = await AnnouncementModel
    .find(baseQuery)
    .sort({ publishedAt: -1 })
    .select("-__v")
    .populate("createdBy", "nickName fullName avatar")
    .populate("lastUpdatedBy", "nickName fullName avatar")
    .populate("publishedBy", "nickName fullName avatar")
    .skip(skip)
    .limit(limit)
    .lean({
      virtuals: true,
    });
  const total = await AnnouncementModel.countDocuments(baseQuery);
  return { data: announcements as IAnnouncement[], total };
};

export const getFeaturedAnnouncementsService = async (authenticatedUser: AuthUser):Promise<IAnnouncement[]> => {
  const tenantId = authenticatedUser.tenantId
  await isHaveAccess(authenticatedUser, null, "Announcement", "read");

  const baseQuery: any = {
    tenantId,
    status: "published",
    isFeatured: true,
  };
  const announcements = await AnnouncementModel
    .find(baseQuery)
    .sort({ publishedAt: -1 })
    .select("-__v")
    .populate("createdBy", "nickName fullName avatar")
    .populate("lastUpdatedBy", "nickName fullName avatar")
    .populate("publishedBy", "nickName fullName avatar")
    .lean({
      virtuals: true,
    });
  return announcements as IAnnouncement[];
};

export const getAnnouncementByIdService = async (authenticatedUser: AuthUser, id: string) => {
  await isHaveAccess(authenticatedUser, null, "Announcement", "read");

  const announcement = await AnnouncementModel.findById(id);
  return announcement;
};

export const updateAnnouncementService = async (authenticatedUser: AuthUser, id: string, announcement: Partial<IAnnouncement>) => {
  await isHaveAccess(authenticatedUser, null, "Announcement", "manage");

  const payload = {
    ...announcement,
    lastUpdatedBy: authenticatedUser.userId,
    ...(announcement.status === "published" && !announcement.publishedAt ? { publishedAt: new Date() } : {}),
    ...(announcement.status === "published" && announcement.publishedBy ? { publishedBy: authenticatedUser.userId } : {}),
  }

  const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(id, payload, { new: true });
  return updatedAnnouncement;
};

export const deleteAnnouncementService = async (authenticatedUser: AuthUser, id: string) => {
  await isHaveAccess(authenticatedUser, null, "Announcement", "manage");
  
  const deletedAnnouncement = await AnnouncementModel.findByIdAndUpdate(id, { status: "deleted" }, { new: true });
  return deletedAnnouncement;
};