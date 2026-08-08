import { AuthUser } from "../../modules/authentication/interfaces";
import { QueryOptions } from "../../modules/global";
import { CreateNotificationDto } from "./interfaces";
import Notification from "./schema";

export async function createNotificationService(dto: CreateNotificationDto) {

  const notifications = dto.recipients.map((recipientId) => ({
    tenantId: dto.tenantId,
    recipientId,
    actorId: dto.actorId,
    type: dto.type,
    title: dto.title,
    message: dto.message,
    data: dto.data,
  }));

  return Notification.insertMany(notifications);
}

export async function getMineService(
  authenticatedUser: AuthUser,
  options: QueryOptions
) {
  const { userId } = authenticatedUser;
  const { page = 1, limit = 10 } = options;

  const skip = (page - 1) * limit;

  const baseQuery = {
    recipientId: userId,
  };

  const [notifications, total] = await Promise.all([
    Notification.find(baseQuery)
      .sort({ createdAt: -1 })
      .select('-__v -updatedAt -tenantId -recipientId')
      .populate('actorId', 'fullName email nickName')
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(baseQuery),
  ]);

  return { data: notifications, total };
}

export async function getUnreadCountService(authenticatedUser: AuthUser) {
  const userId = authenticatedUser.userId;

  return Notification.countDocuments({
    recipientId: userId,
    isRead: false,
  }); 
}

export async function markAsReadService(id: string, authenticatedUser: AuthUser) {
  const userId = authenticatedUser.userId;

  return Notification.findOneAndUpdate(
    {
      _id: id,
      recipientId: userId,
    },
    {
      isRead: true,
      readAt: new Date(),
    },
    {
      new: true,
    }
  );
}

export async function markAllAsReadService(authenticatedUser: AuthUser) {
  const userId = authenticatedUser.userId;

  const updatedNotifications = await Notification.updateMany(
    {
      recipientId: userId,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );

  const totalUpdated = updatedNotifications.modifiedCount;

  return totalUpdated;
}
