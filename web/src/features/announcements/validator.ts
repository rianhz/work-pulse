import { ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER } from "@/helpers/constants";
import z from "zod";

const isHtmlEmpty = (htmlString: string) => {
  const cleanText = htmlString.replace(/<[^>]*>/g, '').trim();
  return cleanText.length === 0;
};

export const announcementSchema = z.object({
  title: z.string().min(1).refine((val) => !isHtmlEmpty(val), {
      message: "Title cannot be empty",
    }),
  description: z.string().optional(),
  content: z.string().optional().refine((val) => val && !isHtmlEmpty(val), {
    message: "Content cannot be empty",
  }),
  cover: z.string().optional(),
  type: z.enum([ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER]),
  status: z.enum(["draft", "published", "archived", "deleted"]),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;