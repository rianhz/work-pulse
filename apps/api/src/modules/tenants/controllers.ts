import { Request, Response } from 'express';
import { createTenantService, deleteTenantService, getPublicTenantService, getTenantService, updateTenantService } from './services';
import { asyncHandler } from '../../middleware/async-handler';
import { HTTPSTATUS } from '../../utils/http-config';

export const getTenantController = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.id as string;
    const authenticatedUser = (req as any).user;

    const tenant = await getTenantService(authenticatedUser, tenantId);
    res.status(HTTPSTATUS.OK).json({ success: true, data: tenant });
});

export const getPublicTenantController = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.id as string;
    const tenant = await getPublicTenantService(tenantId);
    res.status(HTTPSTATUS.OK).json({ success: true, data: tenant });
});

export const createTenantController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const tenant = await createTenantService(authenticatedUser, req.body);
    res.status(HTTPSTATUS.OK).json({ success: true, data: tenant });
});

export const updateTenantController = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.id;
    const authenticatedUser = (req as any).user;

    const tenant = await updateTenantService(authenticatedUser, tenantId as string, req.body);
    res.status(HTTPSTATUS.OK).json({ success: true, data: tenant });
});

export const deleteTenantController = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.id as string;
    const authenticatedUser = (req as any).user;

    const tenant = await deleteTenantService(authenticatedUser, tenantId as string);
    res.status(HTTPSTATUS.OK).json({ success: true, data: tenant });
});