export interface IIdentity {
  userId: string;
  provider: 'password' | 'google';
  providerUserId: string;
  passwordHash: string;
  email: string;
}