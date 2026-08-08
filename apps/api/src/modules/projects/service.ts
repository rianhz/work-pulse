import { BadRequestException, NotFoundException } from "../../utils/app-error";
import { isHaveAccess } from "../../utils/casl";
import { AuthUser } from "../authentication/interfaces";
import { IProject, IProjectPayload } from "./interfaces";
import { ProjectModel } from "./schema";

export const createProjectService = async (
  authenticatedUser: AuthUser, 
  project: IProjectPayload
): Promise<IProject> => {
  const payload = {
    ...project,
    tenantId: authenticatedUser.tenantId,
    createdBy: authenticatedUser.userId,
    lastUpdatedBy: authenticatedUser.userId,
  };

  // CASL validates if role can create/manage projects within this tenant
  await isHaveAccess(authenticatedUser, "Project", "manage", payload);

  await ProjectModel.validate(payload);
  const newProject = await ProjectModel.create(payload);
  return newProject;
};

export const getProjectsService = async (
  authenticatedUser: AuthUser, 
  tenantId: string, 
  options: { search: string; page: number; limit: number }
): Promise<{ data: IProject[]; total: number }> => {
  const { search, page, limit } = options;
  const skip = (page - 1) * limit;

  // 1. Strict Tenant Scoping
  const baseQuery: Record<string, any> = {
    tenantId: authenticatedUser.tenantId,
    status: { $ne: "deleted" },
  };

  // 2. Employee Specific Filter (Must be in participants)
  if (authenticatedUser.role === "employee") {
    baseQuery.participants = { $in: [authenticatedUser.userId] };
  }

  // 3. General Read Access Check
  await isHaveAccess(authenticatedUser, "Project", "read");

  if (search) {
    baseQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { entity: { $regex: search, $options: "i" } },
    ];
  }

  const [projects, total] = await Promise.all([
    ProjectModel.find(baseQuery)
      .populate({ path: "participants", select: "fullName nickName" })
      .populate({ path: "createdBy", select: "fullName nickName" })
      .populate({ path: "lastUpdatedBy", select: "fullName nickName" })
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: ['formattedCreatedAt', 'formattedUpdatedAt'] }),
    ProjectModel.countDocuments(baseQuery),
  ]);

  return { data: projects, total };
};

export const getProjectService = async (
  authenticatedUser: AuthUser, 
  id: string
): Promise<IProject> => {
  const project = await ProjectModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId,
    status: { $ne: "deleted" }
  }).lean();

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  // Evaluates actual project document against CASL (e.g., checks participants if employee)
  await isHaveAccess(authenticatedUser, "Project", "read", project);

  return project;
};

export const getProjectsByBulkIdsService = async (
  authenticatedUser: AuthUser, 
  ids: string[]
): Promise<IProject[]> => {
  const queryFilter: Record<string, any> = {
    _id: { $in: ids },
    tenantId: authenticatedUser.tenantId,
    status: { $ne: "deleted" },
  };

  // Restrict to participant check if employee
  if (authenticatedUser.role === "employee") {
    queryFilter.participants = { $in: [authenticatedUser.userId] };
  }

  await isHaveAccess(authenticatedUser, "Project", "read");

  const projects = await ProjectModel.find(queryFilter).lean();
  return projects || [];
};

export const updateProjectService = async (
  authenticatedUser: AuthUser, 
  id: string, 
  project: IProjectPayload
): Promise<IProject> => {
  const existingProject = await ProjectModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId,
    status: { $ne: "deleted" }
  }).lean();

  if (!existingProject) {
    throw new NotFoundException('Project not found');
  }

  await isHaveAccess(authenticatedUser, "Project", "manage", existingProject);

  const updatePayload = {
    ...project,
    lastUpdatedBy: authenticatedUser.userId,
  };

  await ProjectModel.validate(updatePayload);

  const updatedProject = await ProjectModel.findByIdAndUpdate(
    id, 
    { $set: updatePayload }, 
    { new: true }
  ).lean({ virtuals: true });

  if (!updatedProject) {
    throw new NotFoundException('Project update failed');
  }

  return updatedProject as unknown as IProject;
};

export const deleteProjectService = async (
  authenticatedUser: AuthUser, 
  id: string
): Promise<IProject> => {
  const existingProject = await ProjectModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId,
    status: { $ne: "deleted" }
  }).lean();

  if (!existingProject) {
    throw new NotFoundException('Project not found');
  }

  await isHaveAccess(authenticatedUser, "Project", "manage", existingProject);

  const deletedProject = await ProjectModel.findByIdAndUpdate(
    id,
    { status: "deleted", lastUpdatedBy: authenticatedUser.userId },
    { new: true }
  ).lean();

  if (!deletedProject) {
    throw new NotFoundException('Project deletion failed');
  }

  return deletedProject as unknown as IProject;
};