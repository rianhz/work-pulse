import mongoose, { Schema } from 'mongoose';
import { ILeaveRequest } from './interfaces';
import { LEAVE_TYPE_ANNUAL_LEAVE, LEAVE_TYPE_SICK_LEAVE, LEAVE_TYPE_MATERNITY_LEAVE, LEAVE_TYPE_PATERNITY_LEAVE, LEAVE_TYPE_PERIOD_LEAVE, LEAVE_TYPE_MARRIAGE_LEAVE, LEAVE_TYPE_UNPAID_LEAVE, LEAVE_TYPE_HOURS_ADJUSTMENT } from '../../../utils/constant';
import { STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED, STATUS_CANCELLED } from '../../../utils/constant';

const LeaveRequestSchema = new Schema(
  {
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
    leaveType: {
      type: String,
      enum: [LEAVE_TYPE_ANNUAL_LEAVE, LEAVE_TYPE_SICK_LEAVE, LEAVE_TYPE_MATERNITY_LEAVE, LEAVE_TYPE_PATERNITY_LEAVE, LEAVE_TYPE_PERIOD_LEAVE, LEAVE_TYPE_MARRIAGE_LEAVE, LEAVE_TYPE_UNPAID_LEAVE, LEAVE_TYPE_HOURS_ADJUSTMENT],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: [STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED, STATUS_CANCELLED],
      default: 'pending',
    },
    
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      required: false,
    },
    reviewedAt: {
      type: Date,
      default: null,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

export const LeaveRequestModel = mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema);
