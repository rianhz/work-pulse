import { UserModel } from './schema';
import { IUser } from './interfaces';
import { IdentityModel } from '../idp/schema';
import { compareValue, hashValue } from '../../utils/bcrypt';
import { BadRequestException, NotFoundException } from '../../utils/app-error';
import { getIdentityService } from '../idp/service';

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