import mongoose from "mongoose";
import { ITimesheet } from "./interfaces";

const timesheetSchema = new mongoose.Schema<ITimesheet>({
    userId: {
        type: String,
        required: true,
    },
    tenantId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    project: {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    payAs: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const TimesheetModel = mongoose.model('Timesheet', timesheetSchema);