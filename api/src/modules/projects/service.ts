import { ProjectModel } from "./schema";
import { IProject, IProjectParticipant } from "./interfaces";
import { NotFoundException } from "../../utils/app-error";
import mongoose from "mongoose";
import { isHaveAccess } from "../../utils/casl";
import { AuthUser } from "../authentication/interfaces";

interface IProjectPayload {
  name: string;
  description?: string;
  entity?: string;
  tenantId: mongoose.Types.ObjectId | string;
  participants?: IProjectParticipant[];
  status: "active" | "inactive" | "deleted";
}

export const createProjectService = async (authenticatedUser: AuthUser, project: IProjectPayload): Promise<IProject> => {
    await isHaveAccess(authenticatedUser, null, "Project", "create");
    const newProject = await ProjectModel.create(project);
    return newProject;
};

export const getProjectsService = async (tenantId: string): Promise<IProject[]> => {
    const projects = await ProjectModel.find({ tenantId }).lean();
    if (!projects) {
        return [];
    }
    return projects;
};

export const getProjectService = async (id: string): Promise<IProject> => {
    const project = await ProjectModel.findById(id).lean();
    if (!project) {
        throw new NotFoundException('Project not found');
    }
    return project;
};

export const getProjectsByBulkIdsService = async (ids: string[]): Promise<IProject[]> => {
    const projects = await ProjectModel.find({ _id: { $in: ids } }).lean();
    if (!projects) {
        return [];
    }
    return projects;
};

export const updateProjectService = async (authenticatedUser: AuthUser, id: string, project: IProjectPayload): Promise<IProject> => {
    await isHaveAccess(authenticatedUser, null, "Project", "update");
    const updatedProject = await ProjectModel.findByIdAndUpdate(id, project, { new: true }).lean();
    if (!updatedProject) {
        throw new NotFoundException('Project not found');
    }
    return updatedProject;
};

export const deleteProjectService = async (authenticatedUser: AuthUser, id: string): Promise<IProject> => {
    await isHaveAccess(authenticatedUser, null, "Project", "delete");
    const deletedProject = await ProjectModel.findByIdAndDelete(id).lean();
    if (!deletedProject) {
        throw new NotFoundException('Project not found');
    }
    return deletedProject;
};