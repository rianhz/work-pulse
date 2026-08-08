import { Types, Document } from "mongoose";

export interface IProjectParticipant {
    user: Types.ObjectId | string;
    role: string;
}
export interface IProject extends Document {
    name: string;
    description: string;
    entity: string;
    tenantId: Types.ObjectId | string;
    participants: IProjectParticipant[] | string[];
    status: "active" | "inactive" | "deleted";
    formattedCreatedAt: string;
    formattedUpdatedAt: string;
    lastUpdatedBy: Types.ObjectId | string;
    createdBy: Types.ObjectId | string;
}

export interface IProjectPayload {
  name: string;
  description?: string;
  entity?: string;
  tenantId: Types.ObjectId | string;
  participants?: IProjectParticipant[];
  status: "active" | "inactive" | "deleted";
}