export interface ILoginResponse extends IResponse{
  accessToken: string;
  refreshToken: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  companyName: string;
  slug: string;
  fullName: string;
  email: string;
  password: string;
}

export interface IRegisterWithGooglePayload {
  token: string;
  companyName: string;
  slug: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}