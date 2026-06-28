import { z } from "zod";

export const projectPayloadSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  entity: z.string().optional(),
  participants: z.array(z.object({
    user: z.string(),
    role: z.string(),
  })).optional(),
  status: z.enum(["active", "inactive", "deleted"]).optional(),
});

export type ProjectPayloadFormValues = z.infer<typeof projectPayloadSchema>;