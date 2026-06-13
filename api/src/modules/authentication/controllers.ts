import { Request, Response } from 'express';
import { loginService, logoutService, registerService } from './services';
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

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    await logoutService(userId);
    res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    res.status(HTTPSTATUS.OK).json({ success: true, message: 'Logged out successfully' });
});
