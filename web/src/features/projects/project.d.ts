import { IResponse } from "@/global";

export interface IProject {
    _id: string;
    name: string;
    description: string;
    entity: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IGetProjectsByBulkIdsResponse extends IResponse<IProject[]> {
  data: IProject[];
}