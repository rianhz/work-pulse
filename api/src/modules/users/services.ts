import { UserModel } from './schema';
import { IUser } from './interfaces';
import { ForbiddenException, NotFoundException } from '../../utils/app-error';
import { getIdentityService } from '../idp/service';
import { AuthUser } from '../authentication/interfaces';
import { QueryOptions } from '../global';

export const getMeService = async (userId: string): Promise<IUser> => {
    const user = await UserModel.findById(userId).select("-refreshToken").select("-__v").select("-createdAt").select("-updatedAt").lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
};

export const addProjectToUserService = async (userId: string, projectId: string): Promise<boolean> => {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    await UserModel.findByIdAndUpdate(userId, { $push: { projects: projectId } });
    return true;
};

export const removeProjectFromUserService = async (userId: string, projectId: string): Promise<boolean> => {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    await UserModel.findByIdAndUpdate(userId, { $pull: { projects: projectId } });
    return true;
};

export const getLoginTypesService = async (userId: string): Promise<('password' | 'google')[]> => {
    const identities = await getIdentityService(userId);
    if (!identities) throw new NotFoundException('Identity not found');
    return identities.map((item) => item.provider);
};

export const updateUserService = async (userId: string, payload: Partial<IUser>): Promise<IUser> => {
    const user = await UserModel.findByIdAndUpdate(userId, payload, { new: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
};

export const getDirectReportsTreeService = async (
  currentUser: AuthUser, 
  options: QueryOptions
): Promise<{ users: IUser[], total: number }> => {
  const { userId, role, tenantId } = currentUser;
  const { search, page, limit } = options;

  const skip = (page - 1) * limit;

  const baseQuery: any = { tenantId };
  if (search) {
    baseQuery.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  switch (role) {
    case "owner":
    case "admin":
      break;

    case "employee":
      throw new ForbiddenException("Employees are not authorized to view the reporting tree.");

    case "team-leader":
      baseQuery.reportsTo = userId;
      baseQuery.role = "employee";
      break;

    case "manager":
      const directTeamLeaders = await UserModel.find({ tenantId, reportsTo: userId, role: "team-leader" }).select("_id");
      const teamLeaderIds = directTeamLeaders.map(tl => tl._id);

      const directEmployees = await UserModel.find({ tenantId, reportsTo: { $in: teamLeaderIds }, role: "employee" }).select("_id");
      const employeeIds = directEmployees.map(emp => emp._id);

      const accessibleUserIds = [...teamLeaderIds, ...employeeIds];
      
      baseQuery._id = { $in: accessibleUserIds };
      break;

    default:
      throw new ForbiddenException("Invalid role mapping.");
  }

  const [users, total] = await Promise.all([
    UserModel.find(baseQuery)
      .populate("reportsTo", "fullName email role")
      .sort({ fullName: 1 })
      .skip(skip)
      .limit(limit),
    UserModel.countDocuments(baseQuery)
  ]);

  return { users, total };
};