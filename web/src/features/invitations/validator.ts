import { z } from "zod";

export const acceptInvitationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: z
    .string()
    .min(6, "Confirm password is required"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>;