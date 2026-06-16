import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters"),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .transform((val) => val.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))
    .pipe(z.string().regex(/^[a-z0-9-]+$/, "Invalid slug format")),

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

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;