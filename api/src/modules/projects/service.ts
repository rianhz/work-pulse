import { ProjectModel } from "./schema";
import { IProject } from "./interfaces";
import { NotFoundException } from "../../utils/app-error";

export const createProjectService = async (project: IProject): Promise<IProject> => {
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

export const updateProjectService = async (id: string, project: IProject): Promise<IProject> => {
    const updatedProject = await ProjectModel.findByIdAndUpdate(id, project, { new: true }).lean();
    if (!updatedProject) {
        throw new NotFoundException('Project not found');
    }
    return updatedProject;
};

export const deleteProjectService = async (id: string): Promise<IProject> => {
    const deletedProject = await ProjectModel.findByIdAndDelete(id).lean();
    if (!deletedProject) {
        throw new NotFoundException('Project not found');
    }
    return deletedProject;
};