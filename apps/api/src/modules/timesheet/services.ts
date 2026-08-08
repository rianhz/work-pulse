import { BadRequestException, NotFoundException } from "../../utils/app-error";
import { isHaveAccess } from "../../utils/casl";
import { AuthUser } from "../authentication/interfaces";
import { ITimesheet } from "./interfaces";
import { TimesheetModel } from "./schema";

export const createTimesheetService = async (
  authenticatedUser: AuthUser, 
  timesheet: Partial<ITimesheet>
): Promise<ITimesheet> => {
  // Ensure timesheet is linked to the authenticated user and tenant
  const payload = {
    ...timesheet,
    userId: authenticatedUser.userId,
    tenantId: authenticatedUser.tenantId,
  };

  // CASL verifies if role can create timesheets for this userId + tenantId
  await isHaveAccess(authenticatedUser, "Timesheet", "create", payload);

  await TimesheetModel.validate(payload);
  const newTimesheet = await TimesheetModel.create(payload);
  return newTimesheet as unknown as ITimesheet;
};

export const getTimesheetsService = async (
  authenticatedUser: AuthUser, 
  targetUserId?: string
): Promise<ITimesheet[]> => {
  const queryFilter: Record<string, any> = {
    tenantId: authenticatedUser.tenantId,
  };

  // Employees and Managers can ONLY view their own timesheets.
  // Owner and Admin can view all, or filter by targetUserId if provided.
  if (authenticatedUser.role === "employee" || authenticatedUser.role === "manager") {
    queryFilter.userId = authenticatedUser.userId;
  } else if (targetUserId) {
    queryFilter.userId = targetUserId;
  }

  await isHaveAccess(authenticatedUser, "Timesheet", "read", {
    userId: queryFilter.userId || authenticatedUser.userId,
    tenantId: authenticatedUser.tenantId,
  });

  const timesheets = await TimesheetModel.find(queryFilter).lean();
  return (timesheets || []) as unknown as ITimesheet[];
};

export const getTimesheetService = async (
  authenticatedUser: AuthUser, 
  id: string
): Promise<ITimesheet> => {
  const timesheet = await TimesheetModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId 
  }).lean();

  if (!timesheet) {
    throw new NotFoundException('Timesheet not found');
  }

  // Pass actual timesheet document (containing userId and tenantId) to CASL
  await isHaveAccess(authenticatedUser, "Timesheet", "read", timesheet);

  return timesheet as unknown as ITimesheet;
};

export const updateTimesheetService = async (
  authenticatedUser: AuthUser, 
  id: string, 
  timesheet: Partial<ITimesheet>
): Promise<ITimesheet> => {
  const existingTimesheet = await TimesheetModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId 
  }).lean();

  if (!existingTimesheet) {
    throw new NotFoundException('Timesheet not found');
  }

  // CASL validates if user owns this timesheet (for Employee/Manager) or has tenant-wide rights (Admin/Owner)
  await isHaveAccess(authenticatedUser, "Timesheet", "update", existingTimesheet);

  const updatedTimesheet = await TimesheetModel.findByIdAndUpdate(
    id, 
    { $set: timesheet }, 
    { new: true }
  ).lean();

  if (!updatedTimesheet) {
    throw new NotFoundException('Timesheet update failed');
  }

  return updatedTimesheet as unknown as ITimesheet;
};

export const deleteTimesheetService = async (
  authenticatedUser: AuthUser, 
  id: string
): Promise<ITimesheet> => {
  const existingTimesheet = await TimesheetModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId 
  }).lean();

  if (!existingTimesheet) {
    throw new NotFoundException('Timesheet not found');
  }

  await isHaveAccess(authenticatedUser, "Timesheet", "delete", existingTimesheet);

  const deletedTimesheet = await TimesheetModel.findByIdAndDelete(id).lean();

  if (!deletedTimesheet) {
    throw new NotFoundException('Timesheet deletion failed');
  }

  return deletedTimesheet as unknown as ITimesheet;
};