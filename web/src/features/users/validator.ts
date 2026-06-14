import { z } from "zod";

export const updateFullNameSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
});

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(1, "New password is required"),
  confirmNewPassword: z.string().min(1, "Confirm password is required"),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

export type UpdateFullNameFormValues = z.infer<typeof updateFullNameSchema>;
export type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;