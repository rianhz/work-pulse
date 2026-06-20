import z from "zod";

export const companySettingsSchema = z.object({
  // status: z.string().optional(),
  // projects: z.array(z.string()).optional(),
  // plan: z.string().optional(),
  logo: z.string().optional(),
  name: z.string().min(1, "Company name is required"),
  slug: z.string().min(1, "Slug is required").transform((val) => val.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))
    .pipe(z.string().regex(/^[a-z0-9-]+$/, "Invalid slug format")),
  description: z.string().min(10, "Description must be at least 10 characters"),
});


export type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>;
