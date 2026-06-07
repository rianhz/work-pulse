import { Request, Response } from 'express';
import { changePasswordService, getMeService } from './services';

export const getMeController = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any).user;
      
        const me = await getMeService(userId);
        res.status(200).json({ success: true, data: me });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const changePasswordController = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any).user;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ success: false, message: 'Current password and new password are required' });
            return;
        }
        await changePasswordService({ userId, currentPassword, newPassword });
        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
