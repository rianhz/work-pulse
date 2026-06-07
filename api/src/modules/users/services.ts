import { UserModel } from './schemas';
import { IUser } from './interfaces';
import bcrypt from 'bcryptjs';
import { IdentityModel } from '../idp/schema';

export const getMeService = async (userId: string): Promise<IUser> => {
    const user = await UserModel.findById(userId).select("-refreshToken").select("-createdAt").select("-updatedAt").select("-__v").lean();
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

    const valid = await bcrypt.compare(currentPassword, identity.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    if (newPassword === currentPassword) throw new Error('New password and old password cannot be the same');

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await IdentityModel.findByIdAndUpdate(identity._id, { $set: { passwordHash } });
    return true;
};
