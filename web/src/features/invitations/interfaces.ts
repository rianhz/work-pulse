export interface IInviteUsersPayload {
  emails: string[];
  role: "admin" | "manager" | "team-leader" | "employee";
}

export interface IAcceptInvitePayload {
  token: string;
  fullName: string;
  email: string;
  password: string;
}