import { Request, Response } from "express";
import { createTimesheetService, deleteTimesheetService, getTimesheetService, getTimesheetsService, updateTimesheetService } from "./services";
import { asyncHandler } from "../../middleware/async-handler";
import { HTTPSTATUS } from "../../utils/http-config";

export const createTimesheetController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const { title, start, end, description, project, payAs } = req.body;

    await createTimesheetService(authenticatedUser, { userId: authenticatedUser.userId, tenantId: authenticatedUser.tenantId, title, start, end, description, project, payAs });
    res.status(HTTPSTATUS.CREATED).json({ success: true, message: "Timesheet created successfully" });
});

export const getTimesheetsController = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const { tenantId } = (req as any).user;
    const timesheets = await getTimesheetsService(userId, tenantId);
    res.status(HTTPSTATUS.OK).json({ success: true, data: timesheets });
});

export const getTimesheetController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const { id } = req.params;
    const timesheet = await getTimesheetService(authenticatedUser, id as string);
    res.status(HTTPSTATUS.OK).json({ success: true, data: timesheet });
});

export const updateTimesheetController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const { id } = req.params;
    const { title, start, end, description, project, payAs } = req.body;
    const timesheet = await updateTimesheetService(authenticatedUser, id as string, { title, start, end, description, project, payAs });
    res.status(HTTPSTATUS.OK).json({ success: true, data: timesheet });
});

export const deleteTimesheetController = asyncHandler(async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const { id } = req.params;
    await deleteTimesheetService(authenticatedUser, id as string);
    res.status(HTTPSTATUS.OK).json({ success: true });
});