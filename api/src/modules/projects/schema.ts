import mongoose from "mongoose";
import { IProject } from "./interfaces";
import { baseDateTimeFormat } from "../../helpers/date-format";
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

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
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }],
        required: false,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "deleted"],
        default: "active",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null,
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

projectSchema.virtual("formattedCreatedAt").get(function(this: Document & IProject & { createdAt: Date }) {
    return this.createdAt ? baseDateTimeFormat(this.createdAt) : null;
});

projectSchema.virtual("formattedUpdatedAt").get(function(this: Document & IProject & { updatedAt: Date }) {
    return this.updatedAt ? baseDateTimeFormat(this.updatedAt) : null;
});

projectSchema.plugin(mongooseLeanVirtuals);

projectSchema.index({ tenantId: 1, status: 1 })

export const ProjectModel = mongoose.model('Project', projectSchema);