import { ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER } from "@/helpers/constants";
import z from "zod";

export const announcementValidator = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  type: z.enum([ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER]),
  status: z.enum(["active", "inactive", "deleted"]),
});