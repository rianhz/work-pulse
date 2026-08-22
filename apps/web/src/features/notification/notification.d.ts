import { NOTIFICATION_TYPE_ANNOUNCEMENT_CREATED, NOTIFICATION_TYPE_LEAVE_APPROVED, NOTIFICATION_TYPE_LEAVE_REQUESTED, NOTIFICATION_TYPE_LEAVE_REJECTED, NOTIFICATION_TYPE_USER_JOINED } from "@/helpers/constants";
import { ITenant } from "../tenants/tenant";
import { IUser } from "../users/users";

export enum NotificationType {
  USER_JOINED = NOTIFICATION_TYPE_USER_JOINED,
  ANNOUNCEMENT_CREATED = NOTIFICATION_TYPE_ANNOUNCEMENT_CREATED,
  LEAVE_REQUESTED = NOTIFICATION_TYPE_LEAVE_REQUESTED,
  LEAVE_APPROVED = NOTIFICATION_TYPE_LEAVE_APPROVED,
  LEAVE_REJECTED = NOTIFICATION_TYPE_LEAVE_REJECTED,
}

export interface INotification {
  _id: string;
  tenantId: Partial<ITenant>;
  actorId?: Partial<IUser>;
  entityType: NotificationType;
  entityId?: string;
  title: string;
  url?: string;
  createdAt: string;
  isRead: boolean;
  message: string;
}