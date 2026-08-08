import { z } from "zod";

export const departmentSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type DepartmentSchema = z.infer<typeof departmentSchema>;