import { BadRequestException, NotFoundException } from "../../utils/app-error";
import { IDepartment } from "./interfaces";
import { DepartmentModel } from "./schema";

export const createDepartmentService = async (payload: IDepartment): Promise<IDepartment> => {
    const existingDepartment = await DepartmentModel.findOne({ name: payload.name, tenantId: payload.tenantId, status: { $ne: "deleted" } }).lean();
    if (existingDepartment) {
        throw new BadRequestException("Department already exists");
    }
    const department = await DepartmentModel.create(payload);
    return department;
}

export const getDepartmentsService = async (tenantId: string): Promise<IDepartment[]> => {
    const departments = await DepartmentModel.find({ tenantId, status: { $ne: "deleted" } }).lean();
    return departments;
}

export const getDepartmentService = async (id: string): Promise<IDepartment> => {
    const department = await DepartmentModel.findById(id).lean();
    if (!department) {
        throw new NotFoundException("Department not found");
    }
    return department;
}

export const updateDepartmentService = async (id: string, payload: IDepartment): Promise<IDepartment> => {
    const department = await DepartmentModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!department) {
        throw new NotFoundException("Department not found");
    }
    return department;
}

export const deleteDepartmentService = async (id: string): Promise<IDepartment> => {
    const department = await DepartmentModel.findByIdAndUpdate(id, { status: "deleted" }, { new: true }).lean();
    if (!department) {
        throw new NotFoundException("Department not found");
    }
    return department;
}

export const disableDepartmentService = async (id: string): Promise<IDepartment> => {
    const department = await DepartmentModel.findByIdAndUpdate(id, { status: "disabled" }, { new: true }).lean();
    if (!department) {
        throw new NotFoundException("Department not found");
    }
    return department;
}

export const enableDepartmentService = async (id: string): Promise<IDepartment> => {
    const department = await DepartmentModel.findByIdAndUpdate(id, { status: "active" }, { new: true }).lean();
    if (!department) {
        throw new NotFoundException("Department not found");
    }
    return department;
}