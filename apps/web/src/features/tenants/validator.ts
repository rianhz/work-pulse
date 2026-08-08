import z from "zod";

export const companySettingsSchema = z.object({
  logo: z.string().optional(),
  name: z.string().min(1, "Company name is required"),
  slug: z.string().min(1, "Slug is required").transform((val) => val.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))
    .pipe(z.string().regex(/^[a-z0-9-]+$/, "Invalid slug format")),
  description: z.string().optional(),
  timezone: z.string().optional(),
});


export type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>;
