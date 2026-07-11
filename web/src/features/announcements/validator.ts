import { ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER } from "@/helpers/constants";
import z from "zod";

export const announcementSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().optional(),
  thumbnail: z.string().optional(),
  cover: z.string().optional(),
  type: z.enum([ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER]),
  status: z.enum(["draft", "published", "archived", "deleted"]),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;