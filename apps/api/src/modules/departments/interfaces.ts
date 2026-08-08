import mongoose from "mongoose";

export interface IDepartment {
    _id?: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    tenantId: string;
    status: string;
    // FIX HERE: Use mongoose.Types.ObjectId instead of mongoose.Schema.Types.ObjectId
    createdBy: mongoose.Types.ObjectId; 
    lastUpdatedBy?: mongoose.Types.ObjectId | null;
}