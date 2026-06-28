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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null,
    },
}, {
    timestamps: true,
});

export const DepartmentModel = mongoose.model<IDepartment>("Department", departmentSchema);