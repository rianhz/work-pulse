import { ProjectModel } from "./schema";
import { IProject, IProjectPayload } from "./interfaces";
import { BadRequestException, NotFoundException } from "../../utils/app-error";
import { isHaveAccess } from "../../utils/casl";
import { AuthUser } from "../authentication/interfaces";

export const createProjectService = async (authenticatedUser: AuthUser, project: IProjectPayload): Promise<IProject> => {
    await isHaveAccess(authenticatedUser, null, "Project", "manage");
    const payload = {
        ...project,
        createdBy: authenticatedUser.userId,
        lastUpdatedBy: authenticatedUser.userId,
    };
    await ProjectModel.validate(payload);
    const newProject = await ProjectModel.create(payload);
    return newProject;
};

export const getProjectsService = async (authenticatedUser: AuthUser, tenantId: string, options: { search: string, page: number, limit: number }): Promise<{ data: IProject[], total: number }> => {
    await isHaveAccess(authenticatedUser, { tenantId }, "Project", "read");
    const { search, page, limit } = options;
    const skip = (page - 1) * limit;
    const baseQuery: any = {
        tenantId,
        status: { $ne: "deleted" },
    };
    if (search) {
        baseQuery.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { entity: { $regex: search, $options: "i" } },
        ];
    }
    const projects = await ProjectModel.find(baseQuery)
        .populate({
            path: "participants",
            select: "fullName nickName",
        })
        .populate({
            path: "createdBy",
            select: "fullName nickName",
        })
        .populate({
            path: "lastUpdatedBy",
            select: "fullName nickName",
        })
        .skip(skip)
        .limit(limit)
        .lean({
            virtuals: ['formattedCreatedAt', 'formattedUpdatedAt'],
        });
    const total = await ProjectModel.countDocuments(baseQuery);
    return { data: projects, total };
};

export const getProjectService = async (authenticatedUser: AuthUser, id: string): Promise<IProject> => {
    await isHaveAccess(authenticatedUser, { _id: id }, "Project", "read", "");
    const project = await ProjectModel.findById(id).lean();
    if (!project) {
        throw new NotFoundException('Project not found');
    }
    return project;
};

export const getProjectsByBulkIdsService = async (authenticatedUser: AuthUser, ids: string[]): Promise<IProject[]> => {
    await isHaveAccess(authenticatedUser, { _id: { $in: ids } }, "Project", "read", "");
    const projects = await ProjectModel.find({ _id: { $in: ids } }).lean();
    if (!projects) {
        return [];
    }
    return projects;
};

export const updateProjectService = async (authenticatedUser: AuthUser, id: string, project: IProjectPayload): Promise<IProject> => {
    await isHaveAccess(authenticatedUser, null, "Project", "update");
    await ProjectModel.validate(project);
    const updatedProject = await ProjectModel.findByIdAndUpdate(id, {...project, lastUpdatedBy: authenticatedUser.userId}, { new: true }).lean({
        virtuals: true,
    });
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