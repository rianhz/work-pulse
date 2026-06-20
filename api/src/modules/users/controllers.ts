import { Request, Response } from 'express';
import { addProjectToUserService, getDirectReportsTreeService, getLoginTypesService, getMeService, removeProjectFromUserService, updateUserService } from './services';
import { HTTPSTATUS } from '../../utils/http-config';
import { asyncHandler } from '../../middleware/async-handler';
import { isHaveAccess } from '../../utils/casl';

export const getMeController = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const me = await getMeService(userId);
    res.status(HTTPSTATUS.OK).json({ success: true, data: me });
});

export const getMeProvidersController = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const providers = await getLoginTypesService(userId);
    res.status(HTTPSTATUS.OK).json({ success: true, data: providers });
});

export const updateUserController = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const authenticatedUser = (req as any).user;

    await isHaveAccess(authenticatedUser, { id: userId }, "User", "update");

    const payload = req.body;
    await updateUserService(userId as string, payload);
    res.status(HTTPSTATUS.OK).json({ success: true, message: 'User updated successfully' });
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

export const getUsersController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    await isHaveAccess(authenticatedUser, null, "User", "read");
    const users = await getDirectReportsTreeService(authenticatedUser);
    res.status(HTTPSTATUS.OK).json({ success: true, data: users });
});