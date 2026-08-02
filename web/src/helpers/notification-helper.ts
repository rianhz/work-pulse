import { NOTIFICATION_TYPE_LEAVE_APPROVED, NOTIFICATION_TYPE_LEAVE_REQUESTED, NOTIFICATION_TYPE_LEAVE_REJECTED, NOTIFICATION_TYPE_USER_JOINED } from "@/helpers/constants";

export const getNotificationTitle = (type: string): string => {
  switch (type) {
    case NOTIFICATION_TYPE_LEAVE_REQUESTED:
      return "New Leave Request";

    case NOTIFICATION_TYPE_LEAVE_APPROVED:
      return "Leave Request Approved";

    case NOTIFICATION_TYPE_LEAVE_REJECTED:
      return "Leave Request Declined";

    case NOTIFICATION_TYPE_USER_JOINED:
      return "New Team Member";

    default:
      return "Notification";
  }
};

export const getNotificationMessage = (
  type: string,
  name: string
): string => {
  switch (type) {
    case NOTIFICATION_TYPE_LEAVE_REQUESTED: {
      return `You have a new leave request that requires your review.`;
    }

    case NOTIFICATION_TYPE_LEAVE_APPROVED: {
      return `Your leave request has been approved.`;
    }

    case NOTIFICATION_TYPE_LEAVE_REJECTED: {
      return `Your leave request was declined.`;
    }

    case NOTIFICATION_TYPE_USER_JOINED: {
      return `You have a new team member.`;
    }

    default:
      return "You have a new update.";
  }
};

export const getNotificationLink = (type: string, id: string): string => {
  const origin = window.location.origin;
  switch (type) {
    case NOTIFICATION_TYPE_LEAVE_REQUESTED:
      return `${origin}/leave-approvals/${id}`;

    case NOTIFICATION_TYPE_LEAVE_APPROVED:
      return `${origin}/leave-requests/${id}`;

    case NOTIFICATION_TYPE_LEAVE_REJECTED:
      return `${origin}/leave-requests/${id}`;

    default:
      return `${origin}/`;
  }
};