import { NOTIFICATION_TYPE_LEAVE_APPROVED, NOTIFICATION_TYPE_LEAVE_CANCELLED, NOTIFICATION_TYPE_LEAVE_REQUESTED, NOTIFICATION_TYPE_LEAVE_REJECTED, NOTIFICATION_TYPE_LEAVE_SUBMITTED, NOTIFICATION_TYPE_USER_JOINED } from "@/helpers/constants";

export const getNotificationTitle = (type: string): string => {
  switch (type) {
    case NOTIFICATION_TYPE_LEAVE_REQUESTED:
      return "Leave Requested";

    case NOTIFICATION_TYPE_LEAVE_APPROVED:
      return "Leave Approved";

    case NOTIFICATION_TYPE_LEAVE_REJECTED:
      return "Leave Declined";

    case NOTIFICATION_TYPE_LEAVE_CANCELLED:
      return "Leave Cancelled";

    case NOTIFICATION_TYPE_LEAVE_SUBMITTED:
      return "Leave Submitted";

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
      return `New leave request that requires your review.`;
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

    case NOTIFICATION_TYPE_LEAVE_CANCELLED: {
      return `Your leave request has been cancelled.`;
    }

    case NOTIFICATION_TYPE_LEAVE_SUBMITTED: {
      return `A new leave request has been submitted.`;
    }

    default:
      return "You have a new update.";
  }
};

export const getNotificationLink = (type: string, id: string): string => {
  const origin = window.location.origin;
  switch (type) {
    case NOTIFICATION_TYPE_LEAVE_REQUESTED:
    case NOTIFICATION_TYPE_LEAVE_APPROVED:
    case NOTIFICATION_TYPE_LEAVE_REJECTED:
      return `${origin}/leave-requests/${id}`;

    default:
      return `${origin}/`;
  }
};