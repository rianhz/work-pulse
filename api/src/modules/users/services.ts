import { UserModel } from './schema';
import { IUser } from './interfaces';
import { ForbiddenException, NotFoundException } from '../../utils/app-error';
import { getIdentityService } from '../idp/service';
import { AuthUser } from '../authentication/interfaces';
import { QueryOptions } from '../global';
import { isHaveAccess } from '../../utils/casl';

export const getMeService = async (userId: string): Promise<IUser> => {
    const user = await UserModel.findById(userId).populate("department").populate("position").select("-refreshToken").select("-__v").select("-createdAt").select("-updatedAt").lean();
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

    case "employee":
      throw new ForbiddenException("Employees are not authorized to view the reporting tree.");

    case "manager":
      const directTeamLeaders = await UserModel.find({ tenantId, leader: userId }).select("_id");
      const teamLeaderIds = directTeamLeaders.map(tl => tl._id);

      const directEmployees = await UserModel.find({ tenantId, leader: { $in: teamLeaderIds }, role: "employee" }).select("_id");
      const employeeIds = directEmployees.map(emp => emp._id);

      const accessibleUserIds = [...teamLeaderIds, ...employeeIds];
      
      baseQuery._id = { $in: accessibleUserIds };
      break;

    default:
      throw new ForbiddenException("Invalid role mapping.");
  }

  const [users, total] = await Promise.all([
    UserModel.find(baseQuery)
      .populate("leader", "fullName")
      .populate("department", "name")
      .populate("position", "name")
      .sort({ fullName: 1 })
      .collation({ locale: "en", numericOrdering: true })
      .skip(skip)
      .limit(limit),
    UserModel.countDocuments(baseQuery)
  ]);

  return { users, total };
};  

export const searchUsersService = async (authenticatedUser: AuthUser, search: string): Promise<IUser[]> => {
  await isHaveAccess(authenticatedUser, null, "User", "read");

  const users = await UserModel.find({ fullName: { $regex: search, $options: "i" } }).select("_id fullName email");
  return users;
};