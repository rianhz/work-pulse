import mongoose from "mongoose";
import { IDepartment } from "./interfaces";

export const departmentSchema = new mongoose.Schema<IDepartment>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        default: "",
    },
    tenantId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "active",
    },
}, {
    timestamps: true,
});

export const DepartmentModel = mongoose.model<IDepartment>("Department", departmentSchema);