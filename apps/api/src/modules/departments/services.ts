import { BadRequestException, NotFoundException, ForbiddenException } from "../../utils/app-error";
import { IDepartment } from "./interfaces";
import { DepartmentModel } from "./schema";
import { AuthUser } from "../authentication/interfaces";
import { isHaveAccess } from "../../utils/casl";
import mongoose from "mongoose";

export const createDepartmentService = async (
    authenticatedUser: AuthUser, 
    payload: Omit<IDepartment, "tenantId" | "status" | "createdBy" | "lastUpdatedBy">
): Promise<IDepartment> => {
    await isHaveAccess(authenticatedUser, null, "Department", "create");

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
}

export const getDepartmentsService = async (authenticatedUser: AuthUser): Promise<IDepartment[]> => {
    await isHaveAccess(authenticatedUser, null, "Department", "read");

    const departments = await DepartmentModel.find({ 
        tenantId: authenticatedUser.tenantId, 
        status: { $ne: "deleted" }
    }).populate("createdBy", "fullName").populate("lastUpdatedBy", "fullName").lean();
    
    return departments;
}

export const getDepartmentService = async (authenticatedUser: AuthUser, id: string): Promise<IDepartment> => {
    await isHaveAccess(authenticatedUser, null, "Department", "read");

    const department = await DepartmentModel.findById(id).populate("createdBy", "name").populate("lastUpdatedBy", "name").lean();
    if (!department) {
        throw new NotFoundException("Department not found");
    }

    if (department.tenantId !== authenticatedUser.tenantId && authenticatedUser.role !== "owner") {
        throw new ForbiddenException("You do not have permission to view this department");
    }

    return department;
}

export const updateDepartmentService = async (
    authenticatedUser: AuthUser, 
    id: string, 
    payload: Partial<Omit<IDepartment, "tenantId" | "createdBy" | "lastUpdatedBy">>
): Promise<IDepartment> => {
    await isHaveAccess(authenticatedUser, null, "Department", "update");

    const existingDepartment = await DepartmentModel.findById(id).lean();
    if (!existingDepartment) {
        throw new NotFoundException("Department not found");
    }

    if (existingDepartment.tenantId !== authenticatedUser.tenantId && authenticatedUser.role !== "owner") {
        throw new ForbiddenException("You do not have permission to update this department");
    }

    const department = await DepartmentModel.findByIdAndUpdate(
        id, 
        { 
            name: payload.name, 
            description: payload.description, 
            status: payload.status,
            lastUpdatedBy: authenticatedUser.userId
        }, 
        { new: true }
    ).lean();

    return department!;
}

export const deleteDepartmentService = async (authenticatedUser: AuthUser, id: string): Promise<IDepartment> => {
    await isHaveAccess(authenticatedUser, null, "Department", "delete");

    const existingDepartment = await DepartmentModel.findById(id).lean();
    if (!existingDepartment) {
        throw new NotFoundException("Department not found");
    }

    if (existingDepartment.tenantId !== authenticatedUser.tenantId && authenticatedUser.role !== "owner") {
        throw new ForbiddenException("You do not have permission to delete this department");
    }

    const department = await DepartmentModel.findByIdAndUpdate(
        id, 
        { 
            status: "deleted",
            lastUpdatedBy: authenticatedUser.userId 
        }, 
        { new: true }
    ).lean();
    
    return department!;
}

export const disableDepartmentService = async (authenticatedUser: AuthUser, id: string): Promise<IDepartment> => {
    await isHaveAccess(authenticatedUser, null, "Department", "update");

    const existingDepartment = await DepartmentModel.findById(id).lean();
    if (!existingDepartment) {
        throw new NotFoundException("Department not found");
    }

    if (existingDepartment.tenantId !== authenticatedUser.tenantId && authenticatedUser.role !== "owner") {
        throw new ForbiddenException("You do not have permission to disable this department");
    }

    const department = await DepartmentModel.findByIdAndUpdate(
        id, 
        { 
            status: "disabled",
            lastUpdatedBy: authenticatedUser.userId 
        }, 
        { new: true }
    ).lean();
    
    return department!;
}

export const enableDepartmentService = async (authenticatedUser: AuthUser, id: string): Promise<IDepartment> => {
    await isHaveAccess(authenticatedUser, null, "Department", "update");

    const existingDepartment = await DepartmentModel.findById(id).lean();
    if (!existingDepartment) {
        throw new NotFoundException("Department not found");
    }

    if (existingDepartment.tenantId !== authenticatedUser.tenantId && authenticatedUser.role !== "owner") {
        throw new ForbiddenException("You do not have permission to enable this department");
    }

    const department = await DepartmentModel.findByIdAndUpdate(
        id, 
        { 
            status: "active",
            lastUpdatedBy: authenticatedUser.userId 
        }, 
        { new: true }
    ).lean();
    
    return department!;
}