import { Request, Response } from 'express';
import { createTenantService, deleteTenantService, getTenantService, updateTenantService } from './services';
import { asyncHandler } from '../../middleware/async-handler';
import { HTTPSTATUS } from '../../utils/http-config';

export const getTenantController = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user.tenantId;
    const tenant = await getTenantService(tenantId as string);
    res.status(HTTPSTATUS.OK).json({ success: true, data: tenant });
});

export const createTenantController = asyncHandler(async (req: Request, res: Response) => {
    const tenant = await createTenantService(req.body);
    res.status(HTTPSTATUS.OK).json({ success: true, data: tenant });
});

export const updateTenantController = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user.tenantId;
    const tenant = await updateTenantService(tenantId as string, req.body);
    res.status(HTTPSTATUS.OK).json({ success: true, data: tenant });
});

export const deleteTenantController = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user.tenantId;
    const tenant = await deleteTenantService(tenantId as string);
    res.status(HTTPSTATUS.OK).json({ success: true, data: tenant });
});