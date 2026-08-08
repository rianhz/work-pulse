import mongoose, { Schema } from "mongoose";
import { ILeaveBalance } from "./interfaces";

export const LeaveBalanceSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenantId: {
    type: mongoose.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  balance: {
    type: Number,
    default: 12,
    required: true,
  },
});

export const LeaveBalanceModel = mongoose.model<ILeaveBalance>('LeaveBalance', LeaveBalanceSchema);