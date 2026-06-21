import { createDepartmentService, deleteDepartmentService, disableDepartmentService, enableDepartmentService, getDepartmentService, getDepartmentsService, updateDepartmentService } from "./services";
import { Request, Response } from "express";
import { HTTPSTATUS } from "../../utils/http-config";
import { isHaveAccess } from "../../utils/casl";

export const createDepartmentController = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const authenticatedUser = (req as any).user;
    const { tenantId } = authenticatedUser;

    await isHaveAccess(authenticatedUser, null, "Department", "manage", "create");
    await createDepartmentService({ name, description, tenantId, status: "active" });
    res.status(HTTPSTATUS.OK).json({ success: true });
}

export const getDepartmentsController = async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const { tenantId } = authenticatedUser;
    await isHaveAccess(authenticatedUser, null, "Department", "manage", "read");
    const departments = await getDepartmentsService(tenantId);
    res.status(HTTPSTATUS.OK).json({ success: true, data: departments });
}

export const getDepartmentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const authenticatedUser = (req as any).user;
    await isHaveAccess(authenticatedUser, null, "Department", "manage", "read");
    const department = await getDepartmentService(id as string);
    res.status(HTTPSTATUS.OK).json({ success: true, data: department });
}

export const updateDepartmentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const authenticatedUser = (req as any).user;
    const { tenantId } = authenticatedUser;

    await isHaveAccess(authenticatedUser, null, "Department", "manage", "update");
    await updateDepartmentService(id as string, { name, description, tenantId, status });
    res.status(HTTPSTATUS.OK).json({ success: true });
}

export const deleteDepartmentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const authenticatedUser = (req as any).user;
    await isHaveAccess(authenticatedUser, null, "Department", "manage", "delete");
    await deleteDepartmentService(id as string);
    res.status(HTTPSTATUS.OK).json({ success: true });
}

export const disableDepartmentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const authenticatedUser = (req as any).user;
    await isHaveAccess(authenticatedUser, null, "Department", "manage", "update");
    await disableDepartmentService(id as string);
    res.status(HTTPSTATUS.OK).json({ success: true });
}

export const enableDepartmentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const authenticatedUser = (req as any).user;
    await isHaveAccess(authenticatedUser, null, "Department", "manage", "update");
    await enableDepartmentService(id as string);
    res.status(HTTPSTATUS.OK).json({ success: true });
}