import { Request, Response } from 'express';
import { changePasswordService, googleLoginService, loginService, logoutService, registerService, registerWithGoogleService, removeGoogleService, removePasswordService } from './services';
import { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from '../../utils/constant';
import { BadRequestException } from '../../utils/app-error';
import { HTTPSTATUS } from '../../utils/http-config';
import { asyncHandler } from '../../middleware/async-handler';

export const registerController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, companyName, slug, fullName } = req.body;
    if (!email || !password) {
        throw new BadRequestException('Email and password are required');
    }
    await registerService({ email, password, companyName, slug, fullName });
    res.status(HTTPSTATUS.CREATED).json({ success: true, message: 'User registered successfully' });
});

export const registerWithGoogleController = asyncHandler(async (req: Request, res: Response) => {
    const { token, companyName, slug } = req.body;
    if (!token || !companyName || !slug) {
        throw new BadRequestException('Token, company name and slug are required');
    }
    await registerWithGoogleService({ token, companyName, slug });
    res.status(HTTPSTATUS.CREATED).json({ success: true, message: 'User registered with Google successfully' });
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestException('Email and password are required');
    }
    const { accessToken, refreshToken } = await loginService({ email, password });
    res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(HTTPSTATUS.OK).json({ success: true });
});

export const googleLoginController = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) {
        throw new BadRequestException('Token is required');
    }
    const { accessToken, refreshToken } = await googleLoginService(token);
    res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(HTTPSTATUS.OK).json({ success: true });
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    await logoutService(userId);
    res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    res.status(HTTPSTATUS.OK).json({ success: true, message: 'Logged out successfully' });
});

export const removePasswordController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    await removePasswordService(userId);
    res.status(HTTPSTATUS.OK).json({ success: true, message: 'Password removed successfully' });
});

export const removeGoogleController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    await removeGoogleService(userId);
    res.status(HTTPSTATUS.OK).json({ success: true, message: 'Google removed successfully' });
});

export const changePasswordController = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        throw new BadRequestException('Current password and new password are required');
    }
    await changePasswordService({ userId, currentPassword, newPassword });
    res.status(HTTPSTATUS.OK).json({ success: true, message: 'Password changed successfully' });
});
