import { BadRequestException, NotFoundException } from "../../utils/app-error";
import { IDepartment } from "./interfaces";
import { DepartmentModel } from "./schema";
import { AuthUser } from "../authentication/interfaces";
import { isHaveAccess } from "../../utils/casl";
import mongoose from "mongoose";

export const createDepartmentService = async (
  authenticatedUser: AuthUser, 
  payload: Omit<IDepartment, "tenantId" | "status" | "createdBy" | "lastUpdatedBy">
): Promise<IDepartment> => {
  await isHaveAccess(authenticatedUser, "Department", "create");

  const existingDepartment = await DepartmentModel.findOne({ 
    name: payload.name, 
    tenantId: authenticatedUser.tenantId, 
    status: { $ne: "deleted" }
  });

  if (existingDepartment) {
    throw new BadRequestException("Department already exists");
  }

  const department = await DepartmentModel.create({
    ...payload,
    tenantId: authenticatedUser.tenantId,
    status: "active",
    createdBy: new mongoose.Types.ObjectId(authenticatedUser.userId),  
    lastUpdatedBy: new mongoose.Types.ObjectId(authenticatedUser.userId),
  });

  return department;
};

export const getDepartmentsService = async (authenticatedUser: AuthUser): Promise<IDepartment[]> => {
  await isHaveAccess(authenticatedUser, "Department", "read");

  const departments = await DepartmentModel.find({ 
    tenantId: authenticatedUser.tenantId, 
    status: { $ne: "deleted" }
  })
    .populate("createdBy", "fullName")
    .populate("lastUpdatedBy", "fullName")
    .lean();
    
  return departments as IDepartment[];
};

export const getDepartmentService = async (authenticatedUser: AuthUser, id: string): Promise<IDepartment> => {
  // DB query enforces tenant boundary & ignores deleted items
  const department = await DepartmentModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId, 
    status: { $ne: "deleted" } 
  })
    .populate("createdBy", "fullName")
    .populate("lastUpdatedBy", "fullName")
    .lean();

  if (!department) {
    throw new NotFoundException("Department not found");
  }

  await isHaveAccess(authenticatedUser, "Department", "read", department);

  return department as IDepartment;
};

export const updateDepartmentService = async (
  authenticatedUser: AuthUser, 
  id: string, 
  payload: Partial<Omit<IDepartment, "tenantId" | "createdBy" | "lastUpdatedBy">>
): Promise<IDepartment> => {
  const existingDepartment = await DepartmentModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId, 
    status: { $ne: "deleted" } 
  }).lean();

  if (!existingDepartment) {
    throw new NotFoundException("Department not found");
  }

  await isHaveAccess(authenticatedUser, "Department", "update", existingDepartment);

  const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
    id, 
    { 
      name: payload.name, 
      description: payload.description, 
      status: payload.status,
      lastUpdatedBy: new mongoose.Types.ObjectId(authenticatedUser.userId)
    }, 
    { new: true }
  ).lean();

  return updatedDepartment as IDepartment;
};

export const deleteDepartmentService = async (authenticatedUser: AuthUser, id: string): Promise<IDepartment> => {
  const existingDepartment = await DepartmentModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId, 
    status: { $ne: "deleted" } 
  }).lean();

  if (!existingDepartment) {
    throw new NotFoundException("Department not found");
  }

  await isHaveAccess(authenticatedUser, "Department", "delete", existingDepartment);

  const deletedDepartment = await DepartmentModel.findByIdAndUpdate(
    id, 
    { 
      status: "deleted",
      lastUpdatedBy: new mongoose.Types.ObjectId(authenticatedUser.userId)
    }, 
    { new: true }
  ).lean();
    
  return deletedDepartment as IDepartment;
};

export const disableDepartmentService = async (authenticatedUser: AuthUser, id: string): Promise<IDepartment> => {
  const existingDepartment = await DepartmentModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId, 
    status: { $ne: "deleted" } 
  }).lean();

  if (!existingDepartment) {
    throw new NotFoundException("Department not found");
  }

  await isHaveAccess(authenticatedUser, "Department", "update", existingDepartment);

  const disabledDepartment = await DepartmentModel.findByIdAndUpdate(
    id, 
    { 
      status: "disabled",
      lastUpdatedBy: new mongoose.Types.ObjectId(authenticatedUser.userId)
    }, 
    { new: true }
  ).lean();
    
  return disabledDepartment as IDepartment;
};

export const enableDepartmentService = async (authenticatedUser: AuthUser, id: string): Promise<IDepartment> => {
  const existingDepartment = await DepartmentModel.findOne({ 
    _id: id, 
    tenantId: authenticatedUser.tenantId, 
    status: { $ne: "deleted" } 
  }).lean();

  if (!existingDepartment) {
    throw new NotFoundException("Department not found");
  }

  await isHaveAccess(authenticatedUser, "Department", "update", existingDepartment);

  const enabledDepartment = await DepartmentModel.findByIdAndUpdate(
    id, 
    { 
      status: "active",
      lastUpdatedBy: new mongoose.Types.ObjectId(authenticatedUser.userId)
    }, 
    { new: true }
  ).lean();
    
  return enabledDepartment as IDepartment;
};