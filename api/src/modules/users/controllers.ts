import { Request, Response } from 'express';
import { addProjectToUserService, getDirectReportsTreeService, getLoginTypesService, getMeProjectsService, getMeService, removeProjectFromUserService, searchUsersService, updateUserService } from './services';
import { HTTPSTATUS } from '../../utils/http-config';
import { asyncHandler } from '../../middleware/async-handler';

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
    const payload = req.body;

    await updateUserService(authenticatedUser, userId as string, payload);
    res.status(HTTPSTATUS.OK).json({ success: true, message: 'User updated successfully' });
});

export const addProjectToUserController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const { projectId, userId } = req.body;
    await addProjectToUserService(authenticatedUser, userId, projectId);
    res.status(HTTPSTATUS.OK).json({ success: true, message: 'Project added to user successfully' });
});

export const removeProjectFromUserController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const { projectId, userId } = req.body;
    await removeProjectFromUserService(authenticatedUser, userId, projectId);
    res.status(HTTPSTATUS.OK).json({ success: true, message: 'Project removed from user successfully' });
});

export const getUsersController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;

    const search = req.query.search as string || "";
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    
    const { users, total } = await getDirectReportsTreeService(authenticatedUser, { search, page, limit });
    res.status(HTTPSTATUS.OK).json({ 
      success: true, 
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
});

export const searchUsersController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const search = req.query.search as string || "";
    const users = await searchUsersService(authenticatedUser, search);
    res.status(HTTPSTATUS.OK).json({ success: true, data: users });
});

export const getMeProjectsController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const projects = await getMeProjectsService(authenticatedUser);
    res.status(HTTPSTATUS.OK).json({ success: true, data: projects });
});