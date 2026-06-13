import { asyncHandler } from "../../middleware/async-handler";
import { HTTPSTATUS } from "../../utils/http-config";
import { createProjectService, deleteProjectService, getProjectsService, getProjectService, updateProjectService, getProjectsByBulkIdsService } from "./service";
import { Request, Response } from "express";

export const createProjectController = asyncHandler(async (req: Request, res: Response) => {
    const { tenantId } = (req as any).user;
    const { name, description, entity } = req.body;
    const project = await createProjectService({ name, description, entity, tenantId: tenantId as string });
    res.status(HTTPSTATUS.OK).json({ success: true, data: project });
});

export const getProjectsController = asyncHandler(async (req: Request, res: Response) => {
    const { tenantId } = (req as any).user;
    const projects = await getProjectsService(tenantId as string);
    res.status(HTTPSTATUS.OK).json({ success: true, data: projects });
});

export const getProjectsByBulkIdsController = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;
    const projects = await getProjectsByBulkIdsService(ids as string[]);
    res.status(HTTPSTATUS.OK).json({ success: true, data: projects });
});

export const getProjectController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const project = await getProjectService(id as string);
    res.status(HTTPSTATUS.OK).json({ success: true, data: project });
});

export const updateProjectController = asyncHandler(async (req: Request, res: Response) => {
    const { tenantId } = (req as any).user;
    const { id } = req.params;
    const { name, description, entity } = req.body;
    const project = await updateProjectService(id as string, { name, description, entity, tenantId: tenantId as string });
    res.status(HTTPSTATUS.OK).json({ success: true, data: project });
});

export const deleteProjectController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const project = await deleteProjectService(id as string);
    res.status(HTTPSTATUS.OK).json({ success: true, data: project });
});