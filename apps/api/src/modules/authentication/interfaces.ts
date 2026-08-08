export interface AuthUser {
  userId: string;
  tenantId: string;
  role: string;
}

export interface IRegisterPayload {
    email: string;
    password: string;
    companyName: string;
    slug: string;
    fullName: string;
}

export interface IRegisterWithGooglePayload {
    token: string;
    companyName: string;
    slug: string;
}

export interface ILoginPayload {
    email: string;
    password: string;
}