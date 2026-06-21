export interface IInviteUsersPayload {
  emails: string[];
  role: "admin" | "manager" | "team-leader" | "employee";
  tenantId: string;
}

export interface IAcceptInvitePayload {
  token: string;
  fullName: string;
  password: string;
}