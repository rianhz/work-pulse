import { z } from "zod";

export const updateAccountSettingsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  avatar: z.string().optional(),
  nickName: z.string().optional(),
  birthDate: z.date().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
});

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

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
  role: z.enum(["admin", "manager", "team-leader", "employee"]),
  department: z.string().nullable().or(z.literal("")),
  position: z.string().nullable().or(z.literal("")),
  birthDate: z.string().nullable().or(z.literal("")),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;
export type UpdateAccountSettingsFormValues = z.infer<typeof updateAccountSettingsSchema>;
export type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;