import { generateAccessToken, generateRefreshToken } from '../../helpers/auth-helper';
import { UserModel } from '../users/schema';
import { IUser } from '../users/interfaces';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../../utils/constant';
import { ILoginPayload, IRegisterPayload } from './interfaces';
import { TenantModel } from '../tenants/schema';
import { IdentityModel } from '../idp/schema';
import { compareValue, hashValue } from '../../utils/bcrypt';
import { BadRequestException, NotFoundException } from '../../utils/app-error';

const registerService = async (payload: IRegisterPayload): Promise<IUser> => {
    const { email, password, companyName, slug, fullName } = payload;

    const existingTenant = await TenantModel.findOne({ name: companyName, slug }).lean();

    if (existingTenant) {
        throw new BadRequestException('Tenant already exists');
    }

    const tenant = await TenantModel.create({ name: companyName, slug });


    const existingUser = await UserModel.findOne({ email }).lean();

    if (existingUser) {
        throw new BadRequestException('Email is already registered');
    }

    const user = await UserModel.create({ 
        email, 
        tenantId: tenant._id.toString(),
        fullName,
        role: 'owner',
        status: 'active',
    });

    const passwordHash = await hashValue(password, 10);

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
        throw new NotFoundException('User not found');
    }

    const identity = await IdentityModel.findOne({
      userId: user._id,
      provider: "password",
    });

    if (!identity) {
        throw new BadRequestException("Password login not enabled");
    }

    const valid = await compareValue(password, identity.passwordHash);

    if (!valid) {
        throw new BadRequestException("Invalid credentials");
    }

    const accessToken = generateAccessToken({ userId: user._id.toString(), tenantId: user.tenantId }, ACCESS_TOKEN_EXPIRES_IN); 
    const refreshToken = generateRefreshToken({ userId: user._id.toString(), tenantId: user.tenantId }, REFRESH_TOKEN_EXPIRES_IN);

    const hashedRefreshToken = await hashValue(refreshToken, 10);

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

export { registerService, loginService, logoutService };