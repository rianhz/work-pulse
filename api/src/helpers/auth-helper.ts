import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string, duration: jwt.SignOptions['expiresIn']): string => {
    return jwt.sign(
        { id: userId }, 
        process.env.JWT_ACCESS_SECRET as string, 
        { expiresIn: duration }
    );
};

export const generateRefreshToken = (userId: string, duration: jwt.SignOptions['expiresIn']): string => {
    return jwt.sign(
        { id: userId }, 
        process.env.JWT_REFRESH_SECRET as string, 
        { expiresIn: duration }
    );
};