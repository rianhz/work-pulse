import mongoose from "mongoose";

export interface IDepartment {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    tenantId: string;
    status: string;
    createdBy: mongoose.Types.ObjectId; 
    lastUpdatedBy?: mongoose.Types.ObjectId | null;
}