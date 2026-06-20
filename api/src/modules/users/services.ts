import { UserModel } from './schema';
import { IUser } from './interfaces';
import { IdentityModel } from '../idp/schema';
import { compareValue, hashValue } from '../../utils/bcrypt';
import { BadRequestException, ForbiddenException, NotFoundException } from '../../utils/app-error';
import { getIdentityService } from '../idp/service';
import { AuthUser } from '../authentication/interfaces';
import mongoose from 'mongoose';

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

export const getDirectReportsTreeService = async (currentUser: AuthUser) => {
  const { userId, role, tenantId } = currentUser;

  switch (role) {
    case "owner":
    case "admin":
      // 🏢 Owner/Admin: See EVERYONE in the tenant
      return UserModel.find({ tenantId }).populate("reportsTo", "fullName email role");

    case "employee":
      // 🚫 Employee: Can't see anyone
      throw new ForbiddenException("Employees are not authorized to view the reporting tree.");

    case "team-leader":
      // 👥 Team Leader: Only see users directly reporting to them
      return UserModel.find({ 
        tenantId, 
        reportsTo: userId, 
        role: "employee" 
      });

    case "manager":
      // 🌳 Manager: Needs a tree structure. 
      // Get Team Leaders reporting to them, and nest the Employees reporting to those leaders.
      return UserModel.aggregate([
        {
          $match: {
            tenantId,
            reportsTo: new mongoose.Types.ObjectId(userId),
            role: "team-leader"
          }
        },
        {
          $lookup: {
            from: "users", // MongoDB collection name (usually lowercase plural)
            localField: "_id",
            foreignField: "reportsTo",
            as: "directReports"
          }
        },
        {
          $project: {
            fullName: 1,
            email: 1,
            role: 1,
            status: 1,
            "directReports.fullName": 1,
            "directReports.email": 1,
            "directReports.role": 1,
            "directReports._id": 1
          }
        }
      ]);

    default:
      throw new ForbiddenException("Invalid role mapping.");
  }
}