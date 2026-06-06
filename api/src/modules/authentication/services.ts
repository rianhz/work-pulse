import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../../helpers/auth-helper';
import { UserModel } from '../users/schemas';
import { IUser } from '../users/interfaces';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../../utils/constant';

const registerService = async (email: string, password: string, name: string): Promise<void> => {
    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser) {
        if (existingUser.googleId && !existingUser.passwordHash) {
            throw new Error('This email is registered via Google. Please log in using Google.');
        }
        throw new Error('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await UserModel.create({ email, passwordHash, name });
};

const loginService = async (email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> => {
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (!user.passwordHash) {
        throw new Error('This account uses Google Login. Please sign in with Google.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
        throw new Error('Invalid email or password');
    }

    const accessToken = generateAccessToken((user._id).toString(), ACCESS_TOKEN_EXPIRES_IN); 
    const refreshToken = generateRefreshToken((user._id).toString(), REFRESH_TOKEN_EXPIRES_IN);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await UserModel.findByIdAndUpdate(user._id, { 
        $set: { 
            refreshToken: { 
                token: hashedRefreshToken, 
                expiresIn: REFRESH_TOKEN_EXPIRES_IN, 
                createdAt: new Date() 
            } 
        } 
    });

    return { accessToken, refreshToken };
};

const googleAuthService = async (googleData: { googleId: string; email: string; name: string; avatar?: string }): Promise<{ user: Omit<IUser, 'passwordHash'>; accessToken: string, refreshToken: string }> => {
    const { googleId, email, name, avatar } = googleData;

    let user = await UserModel.findOne({ 
        $or: [{ googleId }, { email }] 
    });

    if (user) {
        if (!user.googleId) {
            user.googleId = googleId;
            if (!user.avatar && avatar) user.avatar = avatar;
            await user.save();
        }
    } else {
        user = await UserModel.create({
            email,
            googleId,
            name,
            avatar
        });
    }

    const userObj = user.toObject ? user.toObject() : user;
    const accessToken = generateAccessToken((userObj._id).toString(), ACCESS_TOKEN_EXPIRES_IN); 
    const refreshToken = generateRefreshToken((userObj._id).toString(), REFRESH_TOKEN_EXPIRES_IN); 

    const { passwordHash: _, ...userWithoutPassword } = userObj;
    return { user: userWithoutPassword, accessToken, refreshToken };
};

const logoutService = async (userId: string): Promise<void> => {
    await UserModel.findByIdAndUpdate(userId, { $set: { refreshToken: null } });
};

const meService = async (userId: string) => {
    const user = await UserModel.findById(userId)
        .select("-passwordHash -refreshToken")
        .lean();

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};


export { registerService, loginService, googleAuthService, logoutService, meService };