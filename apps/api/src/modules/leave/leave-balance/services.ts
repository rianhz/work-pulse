import { NotFoundException } from "../../../utils/app-error";
import { isHaveAccess } from "../../../utils/casl";
import { AuthUser } from "../../../modules/authentication/interfaces";
import { LeaveBalanceModel } from "./schema";

export const updateLeaveBalance = async (authenticatedUser: AuthUser, userId: string, balance: number) => {
  // Pass full resource context to CASL (userId + tenantId)
  await isHaveAccess(authenticatedUser, 'LeaveBalance', 'manage', { 
    userId, 
    tenantId: authenticatedUser.tenantId 
  });

  const leaveBalance = await LeaveBalanceModel.findOneAndUpdate(
    { userId, tenantId: authenticatedUser.tenantId },
    { balance },
    { new: true, upsert: true }
  ).lean();

  return leaveBalance;
};

export const getLeaveBalance = async (authenticatedUser: AuthUser, userId: string) => {
  await isHaveAccess(authenticatedUser, 'LeaveBalance', 'read', { 
    userId, 
    tenantId: authenticatedUser.tenantId 
  });

  const leaveBalance = await LeaveBalanceModel.findOne({ 
    userId, 
    tenantId: authenticatedUser.tenantId 
  }).select('-userId -tenantId -__v -createdAt -updatedAt').lean();

  if (!leaveBalance) {
    throw new NotFoundException("Leave balance record not found");
  }

  return leaveBalance;
};

export const getMyLeaveBalance = async (authenticatedUser: AuthUser) => {
  console.log("--------------------------------", authenticatedUser);
  await isHaveAccess(authenticatedUser, 'LeaveBalance', 'read', {
    userId: authenticatedUser.userId,
    tenantId: authenticatedUser.tenantId
  });

  const leaveBalance = await LeaveBalanceModel.findOne({ 
    userId: authenticatedUser.userId,
    tenantId: authenticatedUser.tenantId 
  }).select('-userId -tenantId -__v -createdAt -updatedAt').lean();

  return leaveBalance;
};