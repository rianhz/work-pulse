import { isHaveAccess } from "../../utils/casl";
import { AuthUser } from "../authentication/interfaces";
import { IAnnouncement } from "./interfaces";
import { AnnouncementModel } from "./schema";
  
export const createAnnouncementService = async (authenticatedUser: AuthUser, announcement: IAnnouncement) => {
 await isHaveAccess(authenticatedUser, null, "Announcement", "manage");

  await AnnouncementModel.validate(announcement);
  const newAnnouncement = await AnnouncementModel.create(announcement);
  return newAnnouncement;
};

export const getAnnouncementsService = async (authenticatedUser: AuthUser, tenantId: string) => {
  await isHaveAccess(authenticatedUser, null, "Announcement", "read");

  const announcements = await AnnouncementModel.find({ tenantId });
  return announcements;
};

export const getAnnouncementByIdService = async (authenticatedUser: AuthUser, id: string) => {
  await isHaveAccess(authenticatedUser, null, "Announcement", "read");

  const announcement = await AnnouncementModel.findById(id);
  return announcement;
};

export const updateAnnouncementService = async (authenticatedUser: AuthUser, id: string, announcement: IAnnouncement) => {
  await isHaveAccess(authenticatedUser, null, "Announcement", "manage");

  await AnnouncementModel.validate(announcement);
  const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(id, announcement, { new: true });
  return updatedAnnouncement;
};

export const deleteAnnouncementService = async (authenticatedUser: AuthUser, id: string) => {
  await isHaveAccess(authenticatedUser, null, "Announcement", "manage");
  
  const deletedAnnouncement = await AnnouncementModel.findByIdAndUpdate(id, { status: "deleted" }, { new: true });
  return deletedAnnouncement;
};