import { z } from "zod";

export const positionSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  status: z.enum(['active', 'disabled', 'deleted']).optional(),
});

export type PositionSchema = z.infer<typeof positionSchema>;