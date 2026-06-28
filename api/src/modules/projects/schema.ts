import mongoose from "mongoose";
import { IProject } from "./interfaces";

export const projectSchema = new mongoose.Schema<IProject>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    entity: {
        type: String,
        required: false,
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Tenant ID is required."],
        ref: "Tenant",
        index: true,
    },
    participants: {
        type: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            role: {
                type: String,
                required: [true, "Project role designation is required."],
                trim: true,
            },
        }],
        required: false,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "deleted"],
        default: "active",
    },
}, {
    timestamps: true,
});

projectSchema.index({ tenantId: 1, status: 1 })

export const ProjectModel = mongoose.model('Project', projectSchema);