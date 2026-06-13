import { TimesheetModel } from "./schema";
import { ITimesheet } from "./interfaces";
import { NotFoundException } from "../../utils/app-error";

export const createTimesheetService = async (timesheet: ITimesheet): Promise<ITimesheet> => {
    const newTimesheet = await TimesheetModel.create(timesheet);
    return newTimesheet;
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