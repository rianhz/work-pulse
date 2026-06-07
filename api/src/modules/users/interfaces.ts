export interface IUser {
    _id: string;
    tenantId: string;
    email: string;
    fullName: string;
    role: string;
    status: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
    refreshToken: {
        token: string | null;
        expiresIn: number | null;
        createdAt: Date | null;
    };
}