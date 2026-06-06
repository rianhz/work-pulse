import { Request, Response, NextFunction } from 'express';
import { getProfile } from './services';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export const getMeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const decoded = jwt.verify(
            req.cookies.accessToken,
            process.env.JWT_ACCESS_SECRET as string
        ) as JwtPayload;

        const userId = decoded.id;
        const profile = await getProfile(userId as string);
        res.status(200).json({ success: true, data: profile });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};