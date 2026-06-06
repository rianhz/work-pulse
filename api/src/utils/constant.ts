import dotenv from 'dotenv';
dotenv.config();

export const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const ACCESS_TOKEN_EXPIRES_IN = 1 * 60;
export const REFRESH_TOKEN_EXPIRES_IN = 30 * 24 * 60 * 60;

export const ACCESS_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax' as const,
    maxAge: ACCESS_TOKEN_EXPIRES_IN * 1000,
    path: '/',
};

export const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax' as const,
    maxAge: REFRESH_TOKEN_EXPIRES_IN * 1000,
    path: '/',
};
