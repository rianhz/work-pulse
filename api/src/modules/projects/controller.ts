import { asyncHandler } from "../../middleware/async-handler";
import { HTTPSTATUS } from "../../utils/http-config";
import { ProjectModel } from "./schema";
import { createProjectService, deleteProjectService, getProjectsService, getProjectService, updateProjectService, getProjectsByBulkIdsService } from "./service";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createProjectController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const { tenantId } = authenticatedUser;
    const tenantIdObjectId = new mongoose.Types.ObjectId(tenantId);
    const { name, description, entity, participants, status } = req.body;

    const dto = {
        name,
        description,
        entity,
        tenantId: tenantIdObjectId,
        participants,
        status,
    }

    await createProjectService(authenticatedUser, dto);
    res.status(HTTPSTATUS.OK).json({ success: true, message: "Project created successfully" });
});

export const getProjectsController = asyncHandler(async (req: Request, res: Response) => {
    const { tenantId } = (req as any).user;

    const search = req.query.search as string || "";
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const authenticatedUser = (req as any).user;

    const projects = await getProjectsService(authenticatedUser, tenantId as string, { search, page, limit });
    res.status(HTTPSTATUS.OK).json({ success: true, data: projects });
});

export const getProjectsByBulkIdsController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const { ids } = req.body;
    const projects = await getProjectsByBulkIdsService(authenticatedUser, ids as string[]);
    res.status(HTTPSTATUS.OK).json({ success: true, data: projects });
});

export const getProjectController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authenticatedUser = (req as any).user;
    const project = await getProjectService(authenticatedUser, id as string);
    res.status(HTTPSTATUS.OK).json({ success: true, data: project });
});

export const updateProjectController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;

    const { tenantId } = authenticatedUser;
    const tenantIdObjectId = new mongoose.Types.ObjectId(tenantId);

    const { id } = req.params;
    const { name, description, entity, participants, status } = req.body;

    const dto = {
        name,
        description,
        entity,
        tenantId: tenantIdObjectId,
        participants,
        status,
    }

    await updateProjectService(authenticatedUser, id as string, dto);
    res.status(HTTPSTATUS.OK).json({ success: true, message: "Project updated successfully" });
});

export const deleteProjectController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const { id } = req.params;
    const project = await deleteProjectService(authenticatedUser, id as string);
    res.status(HTTPSTATUS.OK).json({ success: true, data: project });
});