import { IResponse } from "@/global";
import { IUser } from "../users/users";


export interface IProjectParticipant {
    user: Partial<IUser>;
    role: string;
}
export interface IProject {
    _id: string;
    name: string;
    description: string;
    entity: string;
    tenantId: string;
    participants: IProjectParticipant[];
    status: "active" | "inactive" | "deleted";
    createdAt: Date;
    updatedAt: Date;
}

export interface IGetProjectsByBulkIdsResponse extends IResponse<IProject[]> {
  data: IProject[];
}