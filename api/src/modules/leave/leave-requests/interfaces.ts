import mongoose from "mongoose";
import { LEAVE_TYPE_ANNUAL_LEAVE, LEAVE_TYPE_SICK_LEAVE, LEAVE_TYPE_MATERNITY_LEAVE, LEAVE_TYPE_PATERNITY_LEAVE, LEAVE_TYPE_PERIOD_LEAVE, LEAVE_TYPE_MARRIAGE_LEAVE, LEAVE_TYPE_UNPAID_LEAVE, LEAVE_TYPE_HOURS_ADJUSTMENT } from "../../../utils/constant";
import { STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED, STATUS_CANCELLED } from "../../../utils/constant";

export type LeaveType = 
  | typeof LEAVE_TYPE_ANNUAL_LEAVE 
  | typeof LEAVE_TYPE_SICK_LEAVE 
  | typeof LEAVE_TYPE_MATERNITY_LEAVE 
  | typeof LEAVE_TYPE_PATERNITY_LEAVE 
  | typeof LEAVE_TYPE_PERIOD_LEAVE 
  | typeof LEAVE_TYPE_MARRIAGE_LEAVE 
  | typeof LEAVE_TYPE_UNPAID_LEAVE 
  | typeof LEAVE_TYPE_HOURS_ADJUSTMENT;

export type LeaveStatus = 
  | typeof STATUS_PENDING 
  | typeof STATUS_APPROVED 
  | typeof STATUS_REJECTED 
  | typeof STATUS_CANCELLED;

export interface ILeaveRequest {
  userId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  notes: string;
  status: LeaveStatus;
  requestedAt: Date;
  reviewedBy: mongoose.Types.ObjectId;
}