import { IDepartment } from "../departments/interfaces";
import { IPosition } from "../positions/interfaces";

export interface IUser {
    _id: string;
    tenantId: string;
    email: string;
    fullName: string;
    nickName: string;
    role: string;
    status: string;
    avatar: string;
    projects: string[];
    loginType: ('password' | 'google')[];
    reportsTo: string | null;
    birthDate: Date | null;
    department: IDepartment | null;
    position: IPosition | null;

    refreshToken: {
        token: string | null;
        expiresIn: number | null;
        createdAt: Date | null;
    };
}
