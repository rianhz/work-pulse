import mongoose from "mongoose";
import { IPosition } from "./interfaces";

export const positionSchema = new mongoose.Schema<IPosition>({
    tenantId: {
        type: String,
        required: true,
    },
    
    name: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ['active', 'disabled', 'deleted'],
        default: 'active',
    },
}, {
    timestamps: true,
});

export const PositionModel = mongoose.model<IPosition>("Position", positionSchema);