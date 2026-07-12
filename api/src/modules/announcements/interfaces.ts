import { ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER } from "../../utils/constant";

export interface IAnnouncement {
  title: string;
  cover: string;
  content: string;
  tenantId: string;
  type: typeof ANNOUNCEMENT_TYPE_OFFICE | typeof ANNOUNCEMENT_TYPE_USER;  
  status: "published" | "draft" | "archived" | "deleted";
}