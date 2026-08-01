import { subject } from "@casl/ability";
import { BadRequestException, ForbiddenException, NotFoundException } from "../../../utils/app-error";
import { defineAbilitiesFor, isHaveAccess } from "../../../utils/casl";
import { STATUS_PENDING } from "../../../utils/constant";
import { AuthUser } from "../../authentication/interfaces";
import { LeaveBalanceModel } from "../leave-balance/schema";
import { getLeaveBalance } from "../leave-balance/services";
import { ILeaveRequest } from "./interfaces";
import { LeaveRequestModel } from "./schema";
import moment from "moment";
import mongoose from "mongoose";
import { QueryOptions } from "../../global";

export const createLeaveRequestService = async (authenticatedUser: AuthUser, dto: Partial<ILeaveRequest>) => {
  const currentUserBalance = await getLeaveBalance(authenticatedUser, authenticatedUser.userId);
  const totalLeaveDays = moment(dto.endDate).diff(moment(dto.startDate), 'days') + 1;
  
  if (!currentUserBalance || currentUserBalance.balance <= 0) {
    throw new BadRequestException("You have insufficient leave balance");
  }

  if (totalLeaveDays > currentUserBalance.balance) {
    throw new BadRequestException("You have insufficient leave balance");
  }

  const payload = {
    ...dto,
    status: STATUS_PENDING,
    userId: authenticatedUser.userId,
    tenantId: authenticatedUser.tenantId,
  };

  // CASL checks if Employee can create for themselves in this tenant
  await isHaveAccess(authenticatedUser, 'LeaveRequest', 'create', payload);

  const leaveRequest = await LeaveRequestModel.create(payload);
  await LeaveBalanceModel.updateOne({ userId: leaveRequest.userId }, { $inc: { balance: -totalLeaveDays } });
  return leaveRequest;
};

export const getLeaveRequestsService = async (authenticatedUser: AuthUser, filterDto: Partial<ILeaveRequest> = {}) => {
  // Build DB filter dynamically based on role scoping
  const queryFilter: Record<string, any> = {
    ...filterDto,
    tenantId: authenticatedUser.tenantId, // Strict tenant boundary
  };

  // Employees can ONLY read their own requests
  if (authenticatedUser.role === 'employee') {
    queryFilter.userId = authenticatedUser.userId;
  }

  await isHaveAccess(authenticatedUser, 'LeaveRequest', 'read');

  const leaveRequests = await LeaveRequestModel.find(queryFilter).lean();
  return leaveRequests;
};

export const getMyLeaveRequestsService = async (authenticatedUser: AuthUser, options: QueryOptions) => {
  const { search, page, limit } = options;
  await isHaveAccess(authenticatedUser, 'LeaveRequest', 'read');

  const skip = (page - 1) * limit;
  const baseQuery: any = {
    userId: authenticatedUser.userId,
    tenantId: authenticatedUser.tenantId,
    status: { $ne: "deleted" },
  };
  if (search) {
    baseQuery.$or = [
      { leaveType: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }
  const leaveRequests = await LeaveRequestModel.find(baseQuery).populate("reviewedBy", "nickName fullName").skip(skip).limit(limit).sort({ createdAt: -1 }).lean();
  const total = await LeaveRequestModel.countDocuments(baseQuery);
  return { data: leaveRequests, total };
};

export const getLeaveRequestByIdService = async (authenticatedUser: AuthUser, id: string) => {
  const leaveRequest = await LeaveRequestModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId 
  }).lean();

  if (!leaveRequest) {
    throw new NotFoundException("Leave request not found");
  }

  // CASL validates against the actual document loaded from DB
  await isHaveAccess(authenticatedUser, 'LeaveRequest', 'read', leaveRequest);

  return leaveRequest;
};

export const updateLeaveRequestService = async (
  authenticatedUser: AuthUser, 
  id: string, 
  dto: Partial<ILeaveRequest>
) => {
  const existingRequest = await LeaveRequestModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId 
  }).lean();

  if (!existingRequest) {
    throw new NotFoundException("Leave request not found");
  }

  // 1. CASL Access Check
  await isHaveAccess(authenticatedUser, 'LeaveRequest', 'update', existingRequest);

  // 2. CASL Field-level Permission Check
  const ability = defineAbilitiesFor(authenticatedUser);
  const targetSubject = subject('LeaveRequest', JSON.parse(JSON.stringify(existingRequest)));

  for (const field of Object.keys(dto)) {
    if (!ability.can('update', targetSubject, field)) {
      throw new ForbiddenException(`You are not allowed to update the field '${field}'`);
    }
  }

  // 3. Handle Status Transition & Balance Calculation with Transactions
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const oldStatus = existingRequest.status;
    const newStatus = dto.status;

    // Check if status has changed
    if (newStatus && newStatus !== oldStatus) {
      // Calculate leave days using moment
      const startDate = dto.startDate || existingRequest.startDate;
      const endDate = dto.endDate || existingRequest.endDate;
      const totalLeaveDays = moment(endDate).diff(moment(startDate), 'days') + 1;

      // Case A: Pending/Rejected -> Approved (Deduct balance)
      if (newStatus === "approved" && oldStatus !== "approved") {
        const balanceDoc = await LeaveBalanceModel.findOne({ 
          userId: existingRequest.userId, 
          tenantId: existingRequest.tenantId 
        }).session(session);

        if (!balanceDoc || balanceDoc.balance < totalLeaveDays) {
          throw new BadRequestException(
            `Insufficient leave balance. Required: ${totalLeaveDays}, Available: ${balanceDoc?.balance ?? 0}`
          );
        }

        await LeaveBalanceModel.updateOne(
          { userId: existingRequest.userId, tenantId: existingRequest.tenantId },
          { $inc: { balance: -totalLeaveDays } },
          { session }
        );
      }

      // Case B: Approved -> Rejected or Cancelled (Refund balance)
      if (oldStatus === "approved" && (newStatus === "rejected" || newStatus === "cancelled")) {
        await LeaveBalanceModel.updateOne(
          { userId: existingRequest.userId, tenantId: existingRequest.tenantId },
          { $inc: { balance: totalLeaveDays } },
          { session }
        );
      }
    }

    // 4. Update the Leave Request Document
    const updatedRequest = await LeaveRequestModel.findByIdAndUpdate(
      id, 
      { $set: dto }, 
      { new: true, session }
    ).lean();

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();

    return updatedRequest;

  } catch (error) {
    // Rollback any database changes if error occurs
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const deleteLeaveRequestService = async (authenticatedUser: AuthUser, id: string) => {
  const existingRequest = await LeaveRequestModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId 
  }).lean();

  if (!existingRequest) {
    throw new NotFoundException("Leave request not found");
  }

  await isHaveAccess(authenticatedUser, 'LeaveRequest', 'delete', existingRequest);

  await LeaveRequestModel.findByIdAndDelete(id);
  return { success: true };
};