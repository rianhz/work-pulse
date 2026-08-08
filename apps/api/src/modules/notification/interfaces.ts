import { NOTIFICATION_TYPE_LEAVE_APPROVED, NOTIFICATION_TYPE_LEAVE_REQUESTED, NOTIFICATION_TYPE_LEAVE_REJECTED } from "../../utils/constant";

export enum NotificationType {
  LEAVE_REQUESTED = NOTIFICATION_TYPE_LEAVE_REQUESTED,
  LEAVE_APPROVED = NOTIFICATION_TYPE_LEAVE_APPROVED,
  LEAVE_REJECTED = NOTIFICATION_TYPE_LEAVE_REJECTED,
}

export interface CreateNotificationDto {
  tenantId: string;
  recipients: string[];
  actorId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}