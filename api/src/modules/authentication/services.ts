import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../../helpers/auth-helper';
import { UserModel } from '../users/schemas';
import { IUser } from '../users/interfaces';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../../utils/constant';
import { ILoginPayload, IRegisterPayload } from './interfaces';
import { TenantModel } from '../tenants/schemas';
import { IdentityModel } from '../idp/schema';

const registerService = async (payload: IRegisterPayload): Promise<IUser> => {
    const { email, password, companyName, slug, fullName } = payload;

    const existingTenant = await TenantModel.findOne({ name: companyName, slug }).lean();

    if (existingTenant) {
        throw new Error('Company already exists');
    }

    const tenant = await TenantModel.create({ name: companyName, slug });


    const existingUser = await UserModel.findOne({ email }).lean();

    if (existingUser) {
        throw new Error('Email is already registered');
    }

    const user = await UserModel.create({ 
        email, 
        tenantId: tenant._id.toString(),
        fullName,
        role: 'owner',
        status: 'active',
    });

    const passwordHash = await bcrypt.hash(password, 10);

    await IdentityModel.create({
        userId: user._id.toString(),
        provider: 'password',
        passwordHash,
    });

    return user
};

const loginService = async (payload: ILoginPayload): Promise<{ accessToken: string, refreshToken: string }> => {
    const { email, password } = payload;
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const identity = await IdentityModel.findOne({
      userId: user._id,
      provider: "password",
    });

    if (!identity) {
        throw new Error("Password login not enabled");
    }

    const valid = await bcrypt.compare(password, identity.passwordHash);

    if (!valid) {
        throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken({ userId: user._id.toString(), tenantId: user.tenantId }, ACCESS_TOKEN_EXPIRES_IN); 
    const refreshToken = generateRefreshToken({ userId: user._id.toString(), tenantId: user.tenantId }, REFRESH_TOKEN_EXPIRES_IN);

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


const logoutService = async (userId: string): Promise<void> => {
    await UserModel.findByIdAndUpdate(userId, { $set: { refreshToken: null } });
};

// const meService = async (userId: string) => {
//     const user = await UserModel.findById(userId)
//         .select("-passwordHash -refreshToken")
//         .lean();

//     if (!user) {
//         throw new Error("User not found");
//     }

//     return user;
// };


export { registerService, loginService, logoutService };