import { issueTokens, verifyGoogleToken } from '../../helpers/auth-helper';
import { UserModel } from '../users/schema';
import { IUser } from '../users/interfaces';
import { ILoginPayload, IRegisterPayload, IRegisterWithGooglePayload } from './interfaces';
import { TenantModel } from '../tenants/schema';
import { IdentityModel } from '../idp/schema';
import { compareValue, hashValue } from '../../utils/bcrypt';
import { BadRequestException, NotFoundException } from '../../utils/app-error';
import { IIdentity } from '../idp/interfaces';

export const registerService = async (payload: IRegisterPayload): Promise<IUser> => {
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
        email: email.toLowerCase(), 
        tenantId: tenant._id.toString(),
        fullName,
        role: 'owner',
        status: 'active',
    });

    const passwordHash = await hashValue(password, 10);

    const identityPayload: IIdentity = {
      userId: user._id.toString(),
      provider: "password",
      providerUserId: user.email.toLowerCase(),
      passwordHash,
      email: email.toLowerCase(),
    };

    console.log(identityPayload);

    await IdentityModel.create(identityPayload);

    

    return user
};

export const registerWithGoogleService = async (payload: IRegisterWithGooglePayload): Promise<IUser> => {
    const { token, companyName, slug } = payload;

    const googlePayload = await verifyGoogleToken(token);

    const googleId = googlePayload?.sub;
    const email = googlePayload?.email;

    if (!googleId || !email) {
        throw new BadRequestException("Invalid Google account");
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (existingUser) throw new BadRequestException('User already registered');

    const existingTenant = await TenantModel.findOne({ name: companyName, slug }).lean();
    if (existingTenant) throw new BadRequestException('Tenant already exists');

    const tenant = await TenantModel.create({ name: companyName, slug });

    const user = await UserModel.create({
        email: email.toLowerCase(),
        tenantId: tenant._id.toString(),
        fullName: googlePayload?.name,
        role: 'owner',
        status: 'active',
    });

    await IdentityModel.create({
        userId: user._id.toString(),
        provider: 'google',
        providerUserId: googleId,
        email,
    });

    return user;
}

export const loginService = async (payload: ILoginPayload): Promise<{ accessToken: string, refreshToken: string }> => {
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

    return await issueTokens(user);
};

export const googleLoginService = async (
  token: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const payload = await verifyGoogleToken(token);

  const googleId = payload?.sub;
  const email = payload?.email;

  if (!googleId || !email) {
    throw new BadRequestException("Invalid Google account");
  }

  const identity = await IdentityModel.findOne({
    provider: "google",
    providerUserId: googleId,
  });

  let user: IUser | null = null;

  if (identity) {
    user = await UserModel.findById(identity.userId);

    if (!user) {
      throw new NotFoundException("User linked to Google identity not found");
    }
  } else {
    user = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) throw new NotFoundException("No account found. Please register first.");
    

    await IdentityModel.create({
      userId: user._id.toString(),
      provider: "google",
      providerUserId: googleId,
      email,
    });
  }

  return await issueTokens(user);
};

export const logoutService = async (userId: string): Promise<void> => {
    await UserModel.findByIdAndUpdate(userId, { $set: { refreshToken: null } });
};

export const removePasswordService = async (userId: string): Promise<void> => {
  const identity = await IdentityModel.findOne({ userId, provider: 'password' });
  if (!identity) throw new NotFoundException('Password identity not found');
  await IdentityModel.findByIdAndDelete(identity._id);
};

export const removeGoogleService = async (userId: string): Promise<void> => {
  const identity = await IdentityModel.findOne({ userId, provider: 'google' });
  if (!identity) throw new NotFoundException('Google identity not found');
  await IdentityModel.findByIdAndDelete(identity._id);
};

export const changePasswordService = async ({userId, currentPassword, newPassword}: {userId: string, currentPassword: string, newPassword: string}): Promise<boolean> => {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    const identity = await IdentityModel.findOne({ userId, provider: 'password' });
    if (!identity) throw new NotFoundException('Identity not found');

    const valid = await compareValue(currentPassword, identity.passwordHash);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    if (newPassword === currentPassword) throw new BadRequestException('New password and old password cannot be the same');

    const passwordHash = await hashValue(newPassword, 10);
    await IdentityModel.findByIdAndUpdate(identity._id, { $set: { passwordHash } });
    return true;
};
