import { UserModel } from './schemas';
import { IUser } from './interfaces';

export const getProfile = async (userId: string): Promise<IUser> => {
    const user = await UserModel.findById(userId).lean();
    if (!user) {
        throw new Error('User not found');
    }
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
