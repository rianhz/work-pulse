import { UserModel } from './schema';
import { IUser } from './interfaces';
import { ForbiddenException, NotFoundException } from '../../utils/app-error';
import { getIdentityService } from '../idp/service';
import { AuthUser } from '../authentication/interfaces';
import { QueryOptions } from '../global';
import { isHaveAccess } from '../../utils/casl';
import { ProjectModel } from '../projects/schema';
import { IProject } from '../projects/interfaces';

export const getMeService = async (userId: string): Promise<IUser> => {
    const user = await UserModel.findById(userId).populate("department", "name").select("-refreshToken").select("-__v").select("-createdAt").select("-updatedAt").lean({
      virtuals: true,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
};

export const getLoginTypesService = async (userId: string): Promise<('password' | 'google')[]> => {
    const identities = await getIdentityService(userId);
    if (!identities) throw new NotFoundException('Identity not found');
    return identities.map((item) => item.provider);
};

export const addProjectToUserService = async (authenticatedUser: AuthUser, userId: string, projectId: string): Promise<boolean> => {
    await isHaveAccess(authenticatedUser, { id: userId }, "User", "update");

    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    await UserModel.findByIdAndUpdate(userId, { $push: { projects: projectId } });
    return true;
};

export const removeProjectFromUserService = async (authenticatedUser: AuthUser, userId: string, projectId: string): Promise<boolean> => {
    await isHaveAccess(authenticatedUser, { id: userId }, "User", "update");

    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    await UserModel.findByIdAndUpdate(userId, { $pull: { projects: projectId } });
    return true;
};

export const updateUserService = async (authenticatedUser: AuthUser, userId: string, payload: Partial<IUser>): Promise<IUser> => {
  const user = await UserModel.findByIdAndUpdate(userId, payload, { new: true });
  if (!user) throw new NotFoundException('User not found');

  await isHaveAccess(authenticatedUser, user, "User", "update");
  return user;
};

export const getDirectReportsTreeService = async (
  currentUser: AuthUser, 
  options: QueryOptions
): Promise<{ users: IUser[], total: number }> => {
  const { userId, role, tenantId } = currentUser;
  const { search, page, limit } = options;

  await isHaveAccess(currentUser, null, "User", "read");

  const skip = (page - 1) * limit;
  const baseQuery: any = {
    tenantId,
    status: { $ne: "deleted" },
    role: { $ne: "owner" }
  };  
  if (search) {
    baseQuery.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  switch (role) {
    case "owner":
      baseQuery._id = { $ne: userId };
      break;
    case "admin":
      baseQuery._id = { $ne: userId };
      break;

    case "employee": {
  const me = await UserModel.findById(userId).select("leader");
  if (!me) {
    throw new NotFoundException("User not found.");
  }

  // Base list starts with themselves
  let employeeIds = [userId];
  let currentSearchIds = [userId];

  // Look UPWARD: If this Employee has a leader, include that leader
  if (me.leader) {
    employeeIds.push(me.leader.toString());
  }

  // Look DOWNWARD: Recursive loop to find all descendants (subordinates)
  while (currentSearchIds.length > 0) {
    const nextLevelReports = await UserModel.find({
      tenantId,
      leader: { $in: currentSearchIds },
      status: { $ne: "deleted" },
    }).select("_id");

    if (nextLevelReports.length > 0) {
      const nextLevelIds = nextLevelReports.map(u => u._id.toString());
      employeeIds.push(...nextLevelIds);
      currentSearchIds = nextLevelIds;
    } else {
      currentSearchIds = [];
    }
  }

  baseQuery._id = { $in: [...new Set(employeeIds)] };
  break;
}

case "manager": {
  const me = await UserModel.findById(userId).select("leader");
  if (!me) {
    throw new NotFoundException("User not found.");
  }

  // Base list starts with the Manager's own ID
  let accessibleUserIds = [userId];
  let currentSearchIds = [userId];

  // Look UPWARD: Even though they are a manager, if they report to a higher manager, include them!
  if (me.leader) {
    accessibleUserIds.push(me.leader.toString());
  }

  while (currentSearchIds.length > 0) {
    const nextTierReports = await UserModel.find({
      tenantId,
      leader: { $in: currentSearchIds },
      status: { $ne: "deleted" },
    }).select("_id");

    if (nextTierReports.length > 0) {
      const nextTierIds = nextTierReports.map(u => u._id.toString());
      accessibleUserIds.push(...nextTierIds);
      currentSearchIds = nextTierIds;
    } else {
      currentSearchIds = [];
    }
  }

  baseQuery._id = { $in: [...new Set(accessibleUserIds)] };
  break;
}
    default:
      throw new ForbiddenException("Invalid role mapping.");
  }

  const [users, total] = await Promise.all([
    UserModel.find(baseQuery)
      .populate("leader", "fullName")
      .populate("department", "name")
      .select("-refreshToken")
      .select("-__v")
      .sort({ fullName: 1 })
      .collation({ locale: "en", numericOrdering: true })
      .skip(skip)
      .limit(limit)
      .lean({
        virtuals: true,
      }),
    UserModel.countDocuments(baseQuery)
  ]);

  return { users, total };
};  

export const searchUsersService = async (authenticatedUser: AuthUser, search: string): Promise<IUser[]> => {
  await isHaveAccess(authenticatedUser, null, "User", "read");

  const users = await UserModel.find({ fullName: { $regex: search, $options: "i" } }).select("_id fullName email");
  return users;
};

export const getMeProjectsService = async (authenticatedUser: AuthUser): Promise<IProject[]> => {
  await isHaveAccess(authenticatedUser, { participants: [authenticatedUser.userId] }, "Project", "read");

  const projects = await ProjectModel.find({
    participants: authenticatedUser.userId,
  })
  .select("name")
  .lean({ virtuals: false });
  if (!projects) throw new NotFoundException('Projects not found');
  return projects;
};