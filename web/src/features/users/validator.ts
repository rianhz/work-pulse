import { z } from "zod";

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(1, "New password is required"),
  confirmNewPassword: z.string().min(1, "Confirm password is required"),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

export const editUserSchema = z.object({
  _id: z.string().min(1, "User ID is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "manager", "employee"]),
  department: z.string().nullable().or(z.literal("")),
  position: z.string().optional(),
  birthDate: z.string().nullable().or(z.literal("")),
  leader: z.string().nullable().or(z.literal("")),
  avatar: z.string().optional(),
  nickName: z.string().optional(),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;