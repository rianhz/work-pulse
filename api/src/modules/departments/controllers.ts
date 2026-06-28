import { createDepartmentService, deleteDepartmentService, disableDepartmentService, enableDepartmentService, getDepartmentService, getDepartmentsService, updateDepartmentService } from "./services";
import { Request, Response } from "express";
import { HTTPSTATUS } from "../../utils/http-config";

export const createDepartmentController = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const authenticatedUser = (req as any).user;

    await createDepartmentService(authenticatedUser, { name, description });
    res.status(HTTPSTATUS.OK).json({ success: true });
}

export const getDepartmentsController = async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    
    const departments = await getDepartmentsService(authenticatedUser);
    res.status(HTTPSTATUS.OK).json({ success: true, data: departments });
}

export const getDepartmentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const authenticatedUser = (req as any).user;

    const department = await getDepartmentService(authenticatedUser, id as string);
    res.status(HTTPSTATUS.OK).json({ success: true, data: department });
}

export const updateDepartmentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const authenticatedUser = (req as any).user;

    await updateDepartmentService(authenticatedUser, id as string, { name, description, status });
    res.status(HTTPSTATUS.OK).json({ success: true });
}

export const deleteDepartmentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const authenticatedUser = (req as any).user;

    await deleteDepartmentService(authenticatedUser, id as string);
    res.status(HTTPSTATUS.OK).json({ success: true });
}

export const disableDepartmentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const authenticatedUser = (req as any).user;

    await disableDepartmentService(authenticatedUser, id as string);
    res.status(HTTPSTATUS.OK).json({ success: true });
}

export const enableDepartmentController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const authenticatedUser = (req as any).user;

    await enableDepartmentService(authenticatedUser, id as string);
    res.status(HTTPSTATUS.OK).json({ success: true });
}