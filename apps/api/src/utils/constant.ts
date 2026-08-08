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

export const ANNOUNCEMENT_TYPE_OFFICE = "office-announcement" as const;
export const ANNOUNCEMENT_TYPE_USER = "user-announcement" as const;
