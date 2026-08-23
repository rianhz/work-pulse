import { getTenantSettings, updateTenantSettings } from "./services";
import { HTTPSTATUS } from "../../../utils/http-config";
import { asyncHandler } from "../../../middleware/async-handler";
import { Request, Response } from "express";

export const getTenantSettingsController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const tenantId = req.params.id as string;
    const authenticatedUser = (req as any).user;
    const tenantSettings = await getTenantSettings(authenticatedUser, tenantId);
    console.log(tenantSettings);
    res.status(HTTPSTATUS.OK).json({ success: true, data: tenantSettings });
});

export const updateTenantSettingsController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const tenantId = req.params.id as string;
    const authenticatedUser = (req as any).user;
    const tenantSettings = await updateTenantSettings(authenticatedUser, tenantId, req.body);
    res.status(HTTPSTATUS.OK).json({ success: true, data: tenantSettings });
});