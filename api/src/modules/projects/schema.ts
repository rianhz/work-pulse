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
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const ProjectModel = mongoose.model('Project', projectSchema);