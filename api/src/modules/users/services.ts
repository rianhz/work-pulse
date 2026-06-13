import { UserModel } from './schema';
import { IUser } from './interfaces';
import { IdentityModel } from '../idp/schema';
import { compareValue, hashValue } from '../../utils/bcrypt';
import { NotFoundException } from '../../utils/app-error';

export const getMeService = async (userId: string): Promise<IUser> => {
    const user = await UserModel.findById(userId).select("-refreshToken").select("-__v").lean();
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

export const changePasswordService = async ({userId, currentPassword, newPassword}: {userId: string, currentPassword: string, newPassword: string}): Promise<boolean> => {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');
    
    const identity = await IdentityModel.findOne({ userId, provider: 'password' });
    if (!identity) throw new Error('User identity not found');

    const valid = await compareValue(currentPassword, identity.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    if (newPassword === currentPassword) throw new Error('New password and old password cannot be the same');

    const passwordHash = await hashValue(newPassword, 10);
    await IdentityModel.findByIdAndUpdate(identity._id, { $set: { passwordHash } });
    return true;
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