import { IUser } from "@/features/users/users";

export const isModerator = (role: string) => {
  return role === "admin" || role === "owner";
};