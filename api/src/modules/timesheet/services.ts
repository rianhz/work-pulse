import { TimesheetModel } from "./schema";
import { ITimesheet } from "./interfaces";
import { BadRequestException, NotFoundException } from "../../utils/app-error";
import { isHaveAccess } from "../../utils/casl";
import { AuthUser } from "../authentication/interfaces";

export const createTimesheetService = async (authenticatedUser: AuthUser, timesheet: ITimesheet): Promise<ITimesheet> => {
    try {
        await isHaveAccess(authenticatedUser, timesheet, "Timesheet", "create");
        await TimesheetModel.validate(timesheet);
        const newTimesheet = await TimesheetModel.create(timesheet);
        return newTimesheet;
    } catch (error: any) {
        if(error.name === "ValidationError") {
            throw new BadRequestException(error.message);
        }
        throw error;
    }
};

export const getTimesheetsService = async (userId: string, tenantId: string): Promise<ITimesheet[]> => {
    const timesheets = await TimesheetModel.find({ userId, tenantId }).lean();
    if (!timesheets) {
      return [];
    }
    return timesheets;
};

export const getTimesheetService = async (id: string): Promise<ITimesheet> => {
    const timesheet = await TimesheetModel.findById(id).lean();
    if (!timesheet) {
        throw new NotFoundException('Timesheet not found');
    }
    return timesheet;
};

export const updateTimesheetService = async (id: string, timesheet: ITimesheet): Promise<ITimesheet> => {
    const updatedTimesheet = await TimesheetModel.findByIdAndUpdate(id, timesheet, { new: true }).lean();
    if (!updatedTimesheet) {
        throw new NotFoundException('Timesheet not found');
    }
    return updatedTimesheet;
};

export const deleteTimesheetService = async (id: string): Promise<ITimesheet> => {
    const deletedTimesheet = await TimesheetModel.findByIdAndDelete(id).lean();
    if (!deletedTimesheet) {
        throw new NotFoundException('Timesheet not found');
    }
    return deletedTimesheet;
};