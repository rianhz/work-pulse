import { Request, Response, NextFunction } from 'express';
import { loginService, logoutService, registerService } from './services';
import { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from '../../utils/constant';

export const registerController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, companyName, slug, fullName } = req.body;
        
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }

        await registerService({ email, password, companyName, slug, fullName });
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const loginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }

        const { accessToken, refreshToken } = await loginService({ email, password });

        res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTIONS);
        res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

        res.status(200).json({ 
            success: true,
        });
    } catch (error: any) {
        res.status(401).json({ success: false, message: error.message });
    }
};

export const logoutController = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const userId = (req as any).user.id;

        await logoutService(userId);

        res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);
        res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error: any) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

