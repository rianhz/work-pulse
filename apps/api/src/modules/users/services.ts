import { Types } from 'mongoose';
import { getAccessibleUserIds } from '../../helpers/users-helper';
import { ForbiddenException, NotFoundException } from '../../utils/app-error';
import { isHaveAccess } from '../../utils/casl';
import { AuthUser } from '../authentication/interfaces';
import { QueryOptions } from '../global';
import { getIdentityService } from '../idp/service';
import { IProject } from '../projects/interfaces';
import { ProjectModel } from '../projects/schema';
import { IUser } from './interfaces';
import { UserModel } from './schema';

export const getMeService = async (
  userId: string
): Promise<IUser & { isLeader: boolean }> => {
  const user = await UserModel.findById(userId)
    .populate("department", "name")
    .select("-refreshToken -__v -createdAt -updatedAt")
    .lean({ virtuals: true });

  if (!user) throw new NotFoundException("User not found");

  // Check if at least one active user in the tenant lists this user as their leader
  const hasSubordinates = await UserModel.exists({
    tenantId: user.tenantId,
    leader: userId,
    status: { $ne: "deleted" },
  });

  return {
    ...(user as unknown as IUser),
    isLeader: Boolean(hasSubordinates),
  };
};

export const getLoginTypesService = async (userId: string): Promise<('password' | 'google')[]> => {
  const identities = await getIdentityService(userId);
  if (!identities) throw new NotFoundException('Identity not found');
  return identities.map((item) => item.provider);
};

export const updateUserService = async (
  authenticatedUser: AuthUser, 
  userId: string, 
  payload: Partial<IUser>
): Promise<IUser> => {
  const existingUser = await UserModel.findOne({ 
    _id: userId, 
    tenantId: authenticatedUser.tenantId 
  }).lean();

  if (!existingUser) throw new NotFoundException('User not found');

  // Verify access BEFORE updating the record
  await isHaveAccess(authenticatedUser, "User", "update", {
    ...existingUser,
    userId: existingUser._id.toString()
  });

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId, 
    { $set: payload }, 
    { new: true }
  ).lean();

  if (!updatedUser) throw new NotFoundException('User update failed');

  return updatedUser as unknown as IUser;
};

export const getDirectReportsTreeService = async (
  currentUser: AuthUser,
  options: QueryOptions
): Promise<{ users: IUser[]; total: number }> => {
  const { userId, role, tenantId } = currentUser;
  const { search, page = 1, limit = 10 } = options;

  await isHaveAccess(currentUser, "User", "read", { userId, tenantId });

  const skip = (page - 1) * limit;
  const baseQuery: Record<string, any> = {
    tenantId,
    status: { $ne: "deleted" },
    role: { $ne: "owner" },
  };

  if (search) {
    baseQuery.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // 1. Get base hierarchy IDs (self and subordinates)
  const accessibleUserIds = await getAccessibleUserIds(userId, role, tenantId);

  if (accessibleUserIds === null) {
    // Admin / Owner mode: see everyone in tenant
  } else {
    // 2. Fetch current user to identify their leader
    const me = await UserModel.findById(userId).select("leader").lean();
    const leaderIdStr = me?.leader?.toString();

    // 3. Filter out the leader's ID so they are excluded from the output
    const targetIds = accessibleUserIds
      .map((id) => id.toString())
      .filter((idStr) => idStr !== leaderIdStr);

    baseQuery._id = {
      $in: targetIds.map((id) => new Types.ObjectId(id)),
    };
  }

  const [users, total] = await Promise.all([
    UserModel.find(baseQuery)
      .skip(skip)
      .limit(limit)
      .populate("leader", "fullName")
      .populate("department", "name")
      .lean(),
    UserModel.countDocuments(baseQuery),
  ]);

  return { users, total };
};

export const searchUsersService = async (
  authenticatedUser: AuthUser, 
  search: string
): Promise<IUser[]> => {
  await isHaveAccess(authenticatedUser, "User", "read", {
    userId: authenticatedUser.userId,
    tenantId: authenticatedUser.tenantId
  });

  const users = await UserModel.find({ 
    tenantId: authenticatedUser.tenantId,
    fullName: { $regex: search, $options: "i" },
    status: { $ne: "deleted" }
  })
  .select("_id fullName email")
  .lean();

  return users as unknown as IUser[];
};

export const getMyProjectsService = async (
  authenticatedUser: AuthUser
): Promise<IProject[]> => {
  await isHaveAccess(authenticatedUser, "Project", "read", {
    participants: [authenticatedUser.userId],
    tenantId: authenticatedUser.tenantId
  });

  const projects = await ProjectModel.find({
    tenantId: authenticatedUser.tenantId,
    participants: authenticatedUser.userId,
  })
  .select("name")
  .lean({ virtuals: false });

  return (projects || []) as unknown as IProject[];
};

export const addProjectToUserService = async (
  authenticatedUser: AuthUser, 
  userId: string, 
  projectId: string
): Promise<boolean> => {
  // Check if user has permission to manage projects within the tenant
  await isHaveAccess(authenticatedUser, "Project", "manage", {
    tenantId: authenticatedUser.tenantId
  });

  const targetUser = await UserModel.findOne({ 
    _id: userId, 
    tenantId: authenticatedUser.tenantId 
  }).lean();

  if (!targetUser) throw new NotFoundException('User not found');

  await UserModel.findByIdAndUpdate(userId, { $addToSet: { projects: projectId } });
  return true;
};

export const removeProjectFromUserService = async (
  authenticatedUser: AuthUser, 
  userId: string, 
  projectId: string
): Promise<boolean> => {
  // Check if user has permission to manage projects within the tenant
  await isHaveAccess(authenticatedUser, "Project", "manage", {
    tenantId: authenticatedUser.tenantId
  });

  const targetUser = await UserModel.findOne({ 
    _id: userId, 
    tenantId: authenticatedUser.tenantId 
  }).lean();

  if (!targetUser) throw new NotFoundException('User not found');

  await UserModel.findByIdAndUpdate(userId, { $pull: { projects: projectId } });
  return true;
};