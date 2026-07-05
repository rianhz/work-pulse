import { IResponse } from "@/global";
import { IUser } from "../users/users";
export interface IProject {
    _id: string;
    name: string;
    description: string;
    entity: string;
    tenantId: string;
    participants: Partial<IUser>[];
    status: "active" | "inactive" | "deleted";
    createdAt: Date;
    updatedAt: Date;
    createdBy: Partial<IUser>;
    lastUpdatedBy: Partial<IUser> | null;
    formattedCreatedAt: string;
    formattedUpdatedAt: string;
}

export interface IGetProjectsByBulkIdsResponse extends IResponse<IProject[]> {
  data: IProject[];
}

export interface IProjectPayload {
  name: string;
  description?: string;
  entity?: string;
  participants?: Partial<IUser>[];
  status?: "active" | "inactive" | "deleted";
}