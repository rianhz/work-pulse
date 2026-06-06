import { Request, Response, NextFunction } from 'express';
import { registerService, loginService, googleAuthService, logoutService, meService } from './services';
import { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from '../../utils/constant';

export const registerController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required' });
            return;
        }

        await registerService(email, password, name);
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

        const { accessToken, refreshToken } = await loginService(email, password);

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

export const googleCallbackController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!(req as any).user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=Google%20auth%20failed`);
        }

        const profile = (req as any).user; 

        const googleData = {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value
        };

        const { accessToken, refreshToken } = await googleAuthService(googleData);

        res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTIONS);
        res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

        return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
        
    } catch (error: any) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`);
    }
};

export const meController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user.id;

        const user = await meService(userId);

        res.status(200).json({
            success: true,
            data: user,
        });

    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
