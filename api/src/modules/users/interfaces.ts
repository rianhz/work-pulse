export enum IntegrationType {
    CANVA = 'canva',
    GOOGLE = 'google-drive',
}

export interface IUser {
    _id: string;
    email: string;
    passwordHash?: string;
    googleId?: string;    
    name?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    assetIntegrations: Array<IntegrationType>;
    refreshToken: {
        token: string;
        expiresIn: number;
        createdAt: Date;
    } | null;
}