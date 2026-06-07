import jwt from 'jsonwebtoken';

interface ITokenPayload {
    userId: string;
    tenantId: string;
}

export const generateAccessToken = (payload: ITokenPayload, duration: jwt.SignOptions['expiresIn']): string => {
    return jwt.sign(
        { userId: payload.userId, tenantId: payload.tenantId }, 
        process.env.JWT_ACCESS_SECRET as string, 
        { expiresIn: duration }
    );
};

export const generateRefreshToken = (payload: ITokenPayload, duration: jwt.SignOptions['expiresIn']): string => {
    return jwt.sign(
        { userId: payload.userId, tenantId: payload.tenantId }, 
        process.env.JWT_REFRESH_SECRET as string, 
        { expiresIn: duration }
    );
};