import { Request, Response } from 'express';
import { addProjectToUserService, changePasswordService, getMeService, removeProjectFromUserService } from './services';
import { HTTPSTATUS } from '../../utils/http-config';
import { asyncHandler } from '../../middleware/async-handler';
import { BadRequestException } from '../../utils/app-error';

export const getMeController = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const me = await getMeService(userId);
    res.status(HTTPSTATUS.OK).json({ success: true, data: me });
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

export const addProjectToUserController = asyncHandler(async (req: Request, res: Response) => {
    // const { userId } = (req as any).user;
    const { projectId, userId } = req.body;
    await addProjectToUserService(userId, projectId);
    res.status(HTTPSTATUS.OK).json({ success: true, message: 'Project added to user successfully' });
});

export const removeProjectFromUserController = asyncHandler(async (req: Request, res: Response) => {
    // const { userId } = (req as any).user;
    const { projectId, userId } = req.body;
    await removeProjectFromUserService(userId, projectId);
    res.status(HTTPSTATUS.OK).json({ success: true, message: 'Project removed from user successfully' });
});