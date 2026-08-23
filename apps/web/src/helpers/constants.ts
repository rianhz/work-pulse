export const ANNOUNCEMENT_TYPE_OFFICE = "office-announcement" as const;
export const ANNOUNCEMENT_TYPE_USER = "user-announcement" as const;

export const DEFAULT_THUMBNAIL_IMAGE = "https://res.cloudinary.com/dazkgi5mm/image/upload/v1783855226/thumbnail-default_lbk2z1.svg";
export const DEFAULT_COVER_IMAGE = "https://res.cloudinary.com/dazkgi5mm/image/upload/v1783855226/cover-default_kejip2.svg";
export const DEFAULT_COVER_PLACEHOLDER_IMAGE = "https://res.cloudinary.com/dazkgi5mm/image/upload/v1784436532/Untitled_Design_1920_x_640_px_3_n0zhem.png";


export const LEAVE_TYPE_ANNUAL_LEAVE = "annual_leave" as const;
export const LEAVE_TYPE_SICK_LEAVE = "sick_leave" as const;
export const LEAVE_TYPE_MATERNITY_LEAVE = "maternity_leave" as const;
export const LEAVE_TYPE_PATERNITY_LEAVE = "paternity_leave" as const;
export const LEAVE_TYPE_PERIOD_LEAVE = "period_leave" as const;
export const LEAVE_TYPE_MARRIAGE_LEAVE = "marriage_leave" as const;
export const LEAVE_TYPE_UNPAID_LEAVE = "unpaid_leave" as const;
export const LEAVE_TYPE_HOURS_ADJUSTMENT = "hours_adjustment" as const;

export const STATUS_PENDING = "pending" as const;
export const STATUS_APPROVED = "approved" as const;
export const STATUS_REJECTED = "rejected" as const;
export const STATUS_CANCELLED = "cancelled" as const;
export const STATUS_COMPLETED = "completed" as const;
export const STATUS_IN_PROGRESS = "in_progress" as const;
export const STATUS_AWAITING_APPROVAL = "awaiting_approval" as const;

export const leaveTypesOptions = [
  { label: 'Annual Leave', value: LEAVE_TYPE_ANNUAL_LEAVE },
  { label: 'Sick Leave', value: LEAVE_TYPE_SICK_LEAVE },
  { label: 'Maternity Leave', value: LEAVE_TYPE_MATERNITY_LEAVE },
  { label: 'Paternity Leave', value: LEAVE_TYPE_PATERNITY_LEAVE },
  { label: 'Period Leave', value: LEAVE_TYPE_PERIOD_LEAVE },
  { label: 'Marriage Leave', value: LEAVE_TYPE_MARRIAGE_LEAVE },
  { label: 'Unpaid Leave', value: LEAVE_TYPE_UNPAID_LEAVE },
  { label: 'Hours Adjustment', value: LEAVE_TYPE_HOURS_ADJUSTMENT },
] as const;

export const statusOptions = [
  { label: 'Pending', value: STATUS_PENDING },
  { label: 'Approved', value: STATUS_APPROVED },
  { label: 'Rejected', value: STATUS_REJECTED },
  { label: 'Cancelled', value: STATUS_CANCELLED },
  { label: 'Awaiting Approval', value: STATUS_AWAITING_APPROVAL },
  { label: 'Completed', value: STATUS_COMPLETED },
  { label: 'In Progress', value: STATUS_IN_PROGRESS },
] as const;

export const NOTIFICATION_TYPE_USER_JOINED = "USER_JOINED";
export const NOTIFICATION_TYPE_ANNOUNCEMENT_CREATED = "ANNOUNCEMENT_CREATED";
export const NOTIFICATION_TYPE_LEAVE_REQUESTED = "LEAVE_REQUESTED";
export const NOTIFICATION_TYPE_LEAVE_APPROVED = "LEAVE_APPROVED";
export const NOTIFICATION_TYPE_LEAVE_REJECTED = "LEAVE_REJECTED";
export const NOTIFICATION_TYPE_LEAVE_CANCELLED = "LEAVE_CANCELLED";
export const NOTIFICATION_TYPE_LEAVE_SUBMITTED = "LEAVE_SUBMITTED";


export const notificationTypeLabels = {
  [NOTIFICATION_TYPE_USER_JOINED]: "User Joined",
  [NOTIFICATION_TYPE_ANNOUNCEMENT_CREATED]: "Announcement Created",
  [NOTIFICATION_TYPE_LEAVE_REQUESTED]: "Leave Requested",
  [NOTIFICATION_TYPE_LEAVE_APPROVED]: "Leave Approved",
  [NOTIFICATION_TYPE_LEAVE_REJECTED]: "Leave Rejected",
} as const;

export const AUTH_PROVIDER_EMAIL = "email" as const;
export const AUTH_PROVIDER_GOOGLE = "google" as const;