export interface IInviteUsersPayload {
  emails: string[];
  role: "admin" | "manager" | "employee";
}

export interface IAcceptInvitePayload {
  token: string;
  fullName: string;
  email: string;
  password: string;
}