import { z } from "zod";

export const projectPayloadSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  entity: z.string().optional(),
  participants: z.array(z.object({
    _id: z.string(),
    fullName: z.string(),
  })).optional(),
  status: z.enum(["active", "inactive", "deleted"]),
});

export type ProjectPayloadFormValues = z.infer<typeof projectPayloadSchema>;