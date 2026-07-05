import { ANNOUNCEMENT_TYPE_OFFICE, ANNOUNCEMENT_TYPE_USER } from "../../helpers/constants";

export interface IAnnouncement {
  title: string;
  description: string;
  imageUrl: string;
  tenantId: string;
  type: typeof ANNOUNCEMENT_TYPE_OFFICE | typeof ANNOUNCEMENT_TYPE_USER;  
}