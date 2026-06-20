export interface IUser {
    _id: string;
    tenantId: string;
    email: string;
    fullName: string;
    role: string;
    status: string;
    avatar: string;
    projects: string[];
    loginType: ('password' | 'google')[];
    reportsTo: string | null;
    refreshToken: {
        token: string | null;
        expiresIn: number | null;
        createdAt: Date | null;
    };
}