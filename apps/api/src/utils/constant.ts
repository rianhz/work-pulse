import { Env } from '../config/env-config';

export const ACCESS_TOKEN_SECRET = Env.JWT_ACCESS_SECRET;
export const REFRESH_TOKEN_SECRET = Env.JWT_REFRESH_SECRET;

export const ACCESS_TOKEN_EXPIRES_IN = 15 * 60;
export const REFRESH_TOKEN_EXPIRES_IN = 30 * 24 * 60 * 60;

export const ACCESS_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: Env.NODE_ENV === "production",
    sameSite: 'lax' as const,
    maxAge: ACCESS_TOKEN_EXPIRES_IN * 1000,
    path: '/',
};

export const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: Env.NODE_ENV === "production",
    sameSite: 'lax' as const,
    maxAge: REFRESH_TOKEN_EXPIRES_IN * 1000,
    path: '/',
};

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

export const ANNOUNCEMENT_TYPE_OFFICE = "office-announcement" as const;
export const ANNOUNCEMENT_TYPE_USER = "user-announcement" as const;

export const NOTIFICATION_TYPE_LEAVE_REQUESTED = "LEAVE_REQUESTED";
export const NOTIFICATION_TYPE_LEAVE_APPROVED = "LEAVE_APPROVED";
export const NOTIFICATION_TYPE_LEAVE_REJECTED = "LEAVE_REJECTED";
export const NOTIFICATION_TYPE_LEAVE_CANCELLED = "LEAVE_CANCELLED";
export const NOTIFICATION_TYPE_LEAVE_SUBMITTED = "LEAVE_SUBMITTED";

export const AUTH_PROVIDER_EMAIL = "email" as const;
export const AUTH_PROVIDER_GOOGLE = "google" as const;