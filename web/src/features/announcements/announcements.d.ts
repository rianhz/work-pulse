import { ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER } from "@/helpers/constants";
import { IBaseEntity } from "@/global";
import { IUser } from "../users/users";

export interface IAnnouncement extends IBaseEntity {
  title: string;
  cover: string;
  content: string;
  type: typeof ANNOUNCEMENT_TYPE_OFFICE | typeof ANNOUNCEMENT_TYPE_USER;
  status: "published" | "unpublished" | "draft" | "archived" | "deleted";
  tenantId: string;
  isFeatured: boolean;
  createdBy: IUser;
  lastUpdatedBy: IUser;
  publishedAt: Date | null;
}