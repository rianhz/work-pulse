import { STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED, STATUS_CANCELLED, STATUS_AWAITING_APPROVAL } from "@/helpers/constants";
import { LEAVE_TYPE_ANNUAL_LEAVE, LEAVE_TYPE_SICK_LEAVE, LEAVE_TYPE_MATERNITY_LEAVE, LEAVE_TYPE_PATERNITY_LEAVE, LEAVE_TYPE_PERIOD_LEAVE, LEAVE_TYPE_MARRIAGE_LEAVE, LEAVE_TYPE_UNPAID_LEAVE, LEAVE_TYPE_HOURS_ADJUSTMENT } from "@/helpers/constants";
import { IUser } from "../users/users";
import { ITenant } from "../tenants/tenant";

export interface ILeaveBalance {
  id: string;
  userId: string;
  tenantId: string;
  balance: number;
}

export interface ILeaveRequest {
  _id: string;
  user: Partial<IUser>;
  tenant: Partial<ITenant>;
  leaveType: typeof LEAVE_TYPE_ANNUAL_LEAVE | typeof LEAVE_TYPE_SICK_LEAVE | typeof LEAVE_TYPE_MATERNITY_LEAVE | typeof LEAVE_TYPE_PATERNITY_LEAVE | typeof LEAVE_TYPE_PERIOD_LEAVE | typeof LEAVE_TYPE_MARRIAGE_LEAVE | typeof LEAVE_TYPE_UNPAID_LEAVE | typeof LEAVE_TYPE_HOURS_ADJUSTMENT;
  startDate: Date;
  endDate: Date;
  status: typeof STATUS_PENDING | typeof STATUS_APPROVED | typeof STATUS_REJECTED | typeof STATUS_CANCELLED | typeof STATUS_AWAITING_APPROVAL;
  reviewer?: Partial<IUser>;
  notes?: string;
  rejectionReason?: string;
}