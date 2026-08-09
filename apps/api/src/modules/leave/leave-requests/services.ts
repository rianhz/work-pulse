import { subject } from "@casl/ability";
import { BadRequestException, ForbiddenException, NotFoundException } from "../../../utils/app-error";
import { defineAbilitiesFor, isHaveAccess } from "../../../utils/casl";
import { STATUS_APPROVED, STATUS_AWAITING_APPROVAL, STATUS_REJECTED } from "../../../utils/constant";
import { AuthUser } from "../../../modules/authentication/interfaces";
import { LeaveBalanceModel } from "../leave-balance/schema";
import { getLeaveBalance } from "../leave-balance/services";
import { ILeaveRequest, LeaveStatus } from "./interfaces";
import { LeaveRequestModel } from "./schema";
import moment from "moment";
import mongoose from "mongoose";
import { QueryOptions } from "../../../modules/global";
import { createNotificationService } from "../../notification/services";
import { UserModel } from "../../../modules/users/schema";
import { NotificationType } from "../../../modules/notification/interfaces";
import { getAccessibleUserIds, getImmediateLeaderUserId } from "../../../helpers/users-helper";

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
    status: STATUS_AWAITING_APPROVAL,
    user: authenticatedUser.userId,
    tenant: authenticatedUser.tenantId,
  };

  await isHaveAccess(authenticatedUser, 'LeaveRequest', 'create', payload);

  const leaveRequest = await LeaveRequestModel.create(payload);
  
  await LeaveBalanceModel.updateOne({ userId: leaveRequest.user }, { $inc: { balance: -totalLeaveDays } });

  const currentUser = await UserModel.findById(authenticatedUser.userId);
  const currentUserLeaderId = await getImmediateLeaderUserId(authenticatedUser.userId, authenticatedUser.tenantId);
  const recipients: string[] = [];

  if (currentUserLeaderId) {
    recipients.push(currentUserLeaderId.toString());
  }
  
  if (recipients.length > 0) {
    await createNotificationService({
      tenantId: authenticatedUser.tenantId,
      recipients,
      actorId: authenticatedUser.userId,
      entityType: NotificationType.LEAVE_REQUESTED,
      title: "Leave need to be reviewed",
      message: `${currentUser?.fullName} has submitted a leave request for review`,
      entityId: leaveRequest._id.toString(),
    });
  }
  return leaveRequest;
};

export const getLeaveRequestsService = async (
  authenticatedUser: AuthUser,
  options: QueryOptions
) => {
  const { search, page = 1, limit = 10 } = options;

  await isHaveAccess(authenticatedUser, "LeaveRequest", "read", {
    tenant: authenticatedUser.tenantId,
    user: authenticatedUser.userId,
  });

  const skip = (page - 1) * limit;

  const queryFilter: Record<string, any> = {
    tenant: authenticatedUser.tenantId,
  };

  if (search) {
    queryFilter.$or = [
      { leaveType: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }

  if (authenticatedUser.role === "owner" || authenticatedUser.role === "admin") {
    // Owner/Admin: See all tenant leave requests
  } else if (authenticatedUser.role === "manager" || authenticatedUser.role === "employee") {
    const accessibleUserIds = await getAccessibleUserIds(authenticatedUser.userId, authenticatedUser.role, authenticatedUser.tenantId);

    let subordinateIds: string[] = [];

    if (accessibleUserIds !== null) {
      const me = await UserModel.findById(authenticatedUser.userId).select("leader").lean();
      const leaderIdStr = me?.leader ? me.leader.toString() : null;

      subordinateIds = accessibleUserIds
        .map((id) => id.toString())
        .filter((id) => id !== authenticatedUser.userId && id !== leaderIdStr);
    }

    if (subordinateIds.length === 0) {
      return { data: [], total: 0 };
    }

    queryFilter.user = { $in: subordinateIds };
  } else {
    return { data: [], total: 0 };
  }

  const [leaveRequests, total] = await Promise.all([
    LeaveRequestModel.find(queryFilter)
      .populate("user", "fullName nickName email -_id")
      .populate("reviewer", "fullName nickName email -_id")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    LeaveRequestModel.countDocuments(queryFilter),
  ]);

  return { data: leaveRequests, total };
};

export const getMyLeaveRequestsService = async (authenticatedUser: AuthUser, options: QueryOptions) => {
  const { search, page = 1, limit = 10 } = options;
  
  await isHaveAccess(authenticatedUser, 'LeaveRequest', 'read', {
    user: authenticatedUser.userId,
    tenant: authenticatedUser.tenantId,
  });

  const skip = (page - 1) * limit;
  const baseQuery: any = {
    user: authenticatedUser.userId,
    tenant: authenticatedUser.tenantId,
    status: { $ne: "deleted" },
  };

  if (search) {
    baseQuery.$or = [
      { leaveType: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }
  
  const leaveRequests = await LeaveRequestModel.find(baseQuery)
    .populate("reviewer", "nickName fullName")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();
    
  const total = await LeaveRequestModel.countDocuments(baseQuery);
  return { data: leaveRequests, total };
};

export const getLeaveRequestByIdService = async (authenticatedUser: AuthUser, id: string) => {
  const leaveRequest = await LeaveRequestModel.findOne({ 
    _id: id, 
    tenant: authenticatedUser.tenantId,
  }).populate({
    path: "user",
    select: "fullName nickName email department avatar position leader", 
    populate: {
      path: "department",
      select: "name",
    },
  })
  .populate({
    path: "reviewer",
    select: "fullName nickName email",
  })
  .lean();

  if (!leaveRequest) {
    throw new NotFoundException("Leave request not found");
  }

  const populatedUser = leaveRequest.user as any;

  // Normalize object structure so CASL gets standard string IDs for matching
  const recordToValidate = {
    ...leaveRequest,
    user: populatedUser?._id?.toString() ?? null,
    tenant: leaveRequest.tenant?.toString() ?? null,
    leader: populatedUser?.leader?.toString() ?? null,
  };

  await isHaveAccess(
    authenticatedUser, 
    'LeaveRequest', 
    'read', 
    subject('LeaveRequest', recordToValidate)
  );

  return leaveRequest;
};

export const updateLeaveRequestService = async (
  authenticatedUser: AuthUser, 
  id: string, 
  dto: Partial<ILeaveRequest>
) => {
  const existingRequest = await LeaveRequestModel.findOne({ 
    _id: id, 
    tenant: authenticatedUser.tenantId 
  }).lean();

  if (!existingRequest) {
    throw new NotFoundException("Leave request not found");
  }

  // Fetch populated user to obtain potential leader context for CASL check
  const populatedUser = await UserModel.findById(existingRequest.user).select("leader").lean();

  const recordToValidate = {
    ...existingRequest,
    user: existingRequest.user?.toString(),
    tenant: existingRequest.tenant?.toString(),
    leader: populatedUser?.leader?.toString() ?? null,
  };

  // 1. Check entity-level update permission
  await isHaveAccess(authenticatedUser, 'LeaveRequest', 'update', recordToValidate);

  // 2. Check field-level update permissions
  const ability = defineAbilitiesFor(authenticatedUser);
  const targetSubject = subject('LeaveRequest', JSON.parse(JSON.stringify(recordToValidate)));

  for (const field of Object.keys(dto)) {
    if (!ability.can('update', targetSubject, field)) {
      throw new ForbiddenException(`You are not allowed to update the field '${field}'`);
    }
  }

  // 3. Handle status transition & balance updates in transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const oldStatus = existingRequest.status;
    const newStatus = dto.status;

    if (newStatus && newStatus !== oldStatus) {
      const startDate = dto.startDate || existingRequest.startDate;
      const endDate = dto.endDate || existingRequest.endDate;
      const totalLeaveDays = moment(endDate).diff(moment(startDate), 'days') + 1;

      if (newStatus === "approved" && oldStatus !== "approved") {
        const balanceDoc = await LeaveBalanceModel.findOne({ 
          userId: existingRequest.user, 
          tenantId: existingRequest.tenant 
        }).session(session);

        await LeaveBalanceModel.updateOne(
          { userId: existingRequest.user, tenantId: existingRequest.tenant },
          { $inc: { balance: -totalLeaveDays } },
          { session }
        );
      }

      if (oldStatus === "approved" && (newStatus === "rejected" || newStatus === "cancelled")) {
        await LeaveBalanceModel.updateOne(
          { userId: existingRequest.user, tenantId: existingRequest.tenant },
          { $inc: { balance: totalLeaveDays } },
          { session }
        );
      }
    }

    const updatedRequest = await LeaveRequestModel.findByIdAndUpdate(
      id, 
      { $set: dto }, 
      { new: true, session }
    ).lean();

    await session.commitTransaction();
    session.endSession();

    return updatedRequest;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const deleteLeaveRequestService = async (authenticatedUser: AuthUser, id: string) => {
  const existingRequest = await LeaveRequestModel.findOne({ 
    _id: id, 
    tenant: authenticatedUser.tenantId 
  }).lean();

  if (!existingRequest) {
    throw new NotFoundException("Leave request not found");
  }

  const recordToValidate = {
    ...existingRequest,
    user: existingRequest.user?.toString(),
    tenant: existingRequest.tenant?.toString(),
  };

  await isHaveAccess(authenticatedUser, 'LeaveRequest', 'delete', recordToValidate);

  await LeaveRequestModel.findByIdAndDelete(id);
  return { success: true };
};

export const approveLeaveRequestService = async (
  authenticatedUser: AuthUser,
  id: string
) => {
  const existingRequest = await LeaveRequestModel.findOne({
    _id: id,
    tenant: authenticatedUser.tenantId,
  }).lean();

  if (!existingRequest) {
    throw new NotFoundException("Leave request not found");
  }

  if (existingRequest.status === STATUS_APPROVED) {
    throw new BadRequestException("Leave request is already approved");
  }

  // Fetch populated user to obtain leader context for CASL check
  const populatedUser = await UserModel.findById(existingRequest.user).select("leader").lean();

  const recordToValidate = {
    ...existingRequest,
    user: existingRequest.user?.toString(),
    tenant: existingRequest.tenant?.toString(),
    leader: populatedUser?.leader?.toString() ?? null,
  };

  // 1. Entity-level update check
  await isHaveAccess(authenticatedUser, "LeaveRequest", "update", recordToValidate);

  // 2. Field-level permissions check for 'status'
  const ability = defineAbilitiesFor(authenticatedUser);
  const targetSubject = subject("LeaveRequest", JSON.parse(JSON.stringify(recordToValidate)));

  if (!ability.can("update", targetSubject, "status")) {
    throw new ForbiddenException("You are not allowed to update the field 'status'");
  }

  // 3. Database Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  let updatedRequest;

  try {
    const oldStatus = existingRequest.status;
    const startDate = existingRequest.startDate;
    const endDate = existingRequest.endDate;
    const totalLeaveDays = moment(endDate).diff(moment(startDate), "days") + 1;

    // Deduct leave balance if it wasn't already approved
    if (oldStatus !== STATUS_APPROVED as LeaveStatus) {
      const balanceDoc = await LeaveBalanceModel.findOne({
        userId: existingRequest.user,
        tenantId: existingRequest.tenant,
      }).session(session);

      await LeaveBalanceModel.updateOne(
        { userId: existingRequest.user, tenantId: existingRequest.tenant },
        { $inc: { balance: -totalLeaveDays } },
        { session }
      );
    }

    updatedRequest = await LeaveRequestModel.findByIdAndUpdate(
      id,
      { $set: { status: STATUS_APPROVED as LeaveStatus, reviewer: authenticatedUser.userId } },
      { new: true, session }
    ).lean();

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  // 4. Safe Async Notification
  try {
    await createNotificationService({
      tenantId: authenticatedUser.tenantId,
      recipients: [existingRequest.user.toString()],
      actorId: authenticatedUser.userId,
      entityType: NotificationType.LEAVE_APPROVED,
      title: "Leave Request Approved",
      message: "Your leave request has been approved.",
      entityId: existingRequest._id.toString(),
    });
  } catch (notificationError) {
    console.error("Failed to dispatch leave approval notification:", notificationError);
  }

  return updatedRequest;
};

export const rejectLeaveRequestService = async (
  authenticatedUser: AuthUser,
  id: string,
  dto?: { rejectionReason?: string }
) => {
  const existingRequest = await LeaveRequestModel.findOne({
    _id: id,
    tenant: authenticatedUser.tenantId,
  }).lean();

  if (!existingRequest) {
    throw new NotFoundException("Leave request not found");
  }

  if (existingRequest.status === STATUS_REJECTED) {
    throw new BadRequestException("Leave request is already rejected");
  }

  // Fetch populated user to obtain leader context for CASL check
  const populatedUser = await UserModel.findById(existingRequest.user).select("leader").lean();

  const recordToValidate = {
    ...existingRequest,
    user: existingRequest.user?.toString(),
    tenant: existingRequest.tenant?.toString(),
    leader: populatedUser?.leader?.toString() ?? null,
  };

  // 1. Entity-level update check
  await isHaveAccess(authenticatedUser, "LeaveRequest", "update", recordToValidate);

  // 2. Field-level permissions check for 'status' and optional 'rejectionReason'
  const ability = defineAbilitiesFor(authenticatedUser);
  const targetSubject = subject("LeaveRequest", JSON.parse(JSON.stringify(recordToValidate)));

  const fieldsToVerify = ["status", ...(dto?.rejectionReason ? ["reason"] : [])];
  for (const field of fieldsToVerify) {
    if (!ability.can("update", targetSubject, field)) {
      throw new ForbiddenException(`You are not allowed to update the field '${field}'`);
    }
  }

  // 3. Database Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  let updatedRequest;

  try {
    const oldStatus = existingRequest.status;

    // Restore leave balance if we are rejecting a request that was previously approved
    if (oldStatus === STATUS_APPROVED) {
      const startDate = existingRequest.startDate;
      const endDate = existingRequest.endDate;
      const totalLeaveDays = moment(endDate).diff(moment(startDate), "days") + 1;

      await LeaveBalanceModel.updateOne(
        { userId: existingRequest.user, tenantId: existingRequest.tenant },
        { $inc: { balance: totalLeaveDays } },
        { session }
      );
    }

    const updatePayload: { status: LeaveStatus; reviewer: string; rejectionReason?: string } = {
      status: STATUS_REJECTED as LeaveStatus,
      ...(dto?.rejectionReason && { rejectionReason: dto.rejectionReason }),
      reviewer: authenticatedUser.userId,
    };

    updatedRequest = await LeaveRequestModel.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, session }
    ).lean();

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  // 4. Safe Async Notification
  try {
    await createNotificationService({
      tenantId: authenticatedUser.tenantId,
      recipients: [existingRequest.user.toString()],
      actorId: authenticatedUser.userId,
      entityType: NotificationType.LEAVE_REJECTED,
      title: "Leave Request Rejected",
      message: "Your leave request has been rejected.",
      entityId: existingRequest._id.toString(),
    });
  } catch (notificationError) {
    console.error("Failed to dispatch leave rejection notification:", notificationError);
  }

  return updatedRequest;
};