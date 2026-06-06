export interface IIdentity {
  userId: string;
  provider: string;
  providerUserId: string;
  passwordHash: string;
  email: string;
}