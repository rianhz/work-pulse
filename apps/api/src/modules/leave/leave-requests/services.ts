import { subject } from "@casl/ability";
import { BadRequestException, ForbiddenException, NotFoundException } from "../../../utils/app-error";
import { defineAbilitiesFor, isHaveAccess } from "../../../utils/casl";
import { STATUS_AWAITING_APPROVAL } from "../../../utils/constant";
import { AuthUser } from "../../../modules/authentication/interfaces";
import { LeaveBalanceModel } from "../leave-balance/schema";
import { getLeaveBalance } from "../leave-balance/services";
import { ILeaveRequest } from "./interfaces";
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
      type: NotificationType.LEAVE_REQUESTED,
      title: "Leave need to be reviewed",
      message: `${currentUser?.fullName} has submitted a leave request for review`,
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
  }).lean();

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

        if (!balanceDoc || balanceDoc.balance < totalLeaveDays) {
          throw new BadRequestException(
            `Insufficient leave balance. Required: ${totalLeaveDays}, Available: ${balanceDoc?.balance ?? 0}`
          );
        }

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