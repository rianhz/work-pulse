import { ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER } from "@/helpers/constants";
import { IBaseEntity } from "@/global";

export interface IAnnouncement extends IBaseEntity {
  title: string;
  description: string;
  imageUrl: string;
  type: typeof ANNOUNCEMENT_TYPE_OFFICE | typeof ANNOUNCEMENT_TYPE_USER;
  status: "active" | "inactive" | "deleted";
  tenantId: string;
}