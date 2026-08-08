import mongoose from "mongoose";

export interface ILeaveBalance {
  userId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  balance: number;
}