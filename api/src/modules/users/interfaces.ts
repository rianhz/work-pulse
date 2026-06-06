export interface IUser {
    _id: string;
    tenantId: string;
    email: string;
    fullName: string;
    role: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    refreshToken: {
        token: string;
        expiresIn: number;
        createdAt: Date;
    } | null;
}