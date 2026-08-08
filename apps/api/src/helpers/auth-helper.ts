import jwt from 'jsonwebtoken';
import { OAuth2Client } from "google-auth-library";
import { getEnv } from '../utils/get-env';
import { IUser } from '../modules/users/interfaces';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../utils/constant';
import { hashValue } from '../utils/bcrypt';
import { UserModel } from '../modules/users/schema';

interface ITokenPayload {
    userId: string;
    tenantId: string;
    role: string;
}

export const generateAccessToken = (payload: ITokenPayload, duration: jwt.SignOptions['expiresIn']): string => {
    return jwt.sign(
        { userId: payload.userId, tenantId: payload.tenantId, role: payload.role }, 
        process.env.JWT_ACCESS_SECRET as string, 
        { expiresIn: duration }
    );
};

export const generateRefreshToken = (payload: ITokenPayload, duration: jwt.SignOptions['expiresIn']): string => {
    return jwt.sign(
        { userId: payload.userId, tenantId: payload.tenantId, role: payload.role }, 
        process.env.JWT_REFRESH_SECRET as string, 
        { expiresIn: duration }
    );
};

export async function verifyGoogleToken(token: string) {
    const client = new OAuth2Client(
        getEnv('GOOGLE_CLIENT_ID')
    );
    try {
        // Set the credentials on the client using the access token
        client.setCredentials({ access_token: token });

        // Request the user's profile info from Google's userinfo endpoint
        const response = await client.request<{
            sub: string;
            email: string;
            name: string;
            picture?: string;
        }>({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        });

        // Return the data formatted to match your previous payload expectations
        return response.data;
        
    } catch (error) {
        // Fallback or log error if the token is completely invalid/expired
        return null;
    }
}

export const issueTokens = async (
  user: IUser,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const accessToken = generateAccessToken(
    {
      userId: user._id.toString(),
      tenantId: user.tenantId,
      role: user.role,
    },
    ACCESS_TOKEN_EXPIRES_IN
  );

  const refreshToken = generateRefreshToken(
    {
      userId: user._id.toString(),
      tenantId: user.tenantId,
      role: user.role,
    },
    REFRESH_TOKEN_EXPIRES_IN
  );

  const hashedRefreshToken = await hashValue(
    refreshToken,
    10
  );

  await UserModel.findByIdAndUpdate(user._id, {
    $set: {
      refreshToken: {
        token: hashedRefreshToken,
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        createdAt: new Date(),
      },
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};