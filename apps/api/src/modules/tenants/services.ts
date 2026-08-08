import { TenantModel } from './schema';
import { ITenant } from './interfaces';
import { NotFoundException, ForbiddenException } from '../../utils/app-error';
import { AuthUser } from '../authentication/interfaces';
import { isHaveAccess } from '../../utils/casl';

export const getTenantService = async (authenticatedUser: AuthUser, tenantId: string): Promise<ITenant> => {
    if (authenticatedUser.role !== "owner" && authenticatedUser.tenantId !== tenantId) {
        throw new ForbiddenException('You do not have access to this tenant\'s data');
    }

    const tenant = await TenantModel.findById(tenantId).lean();
    if (!tenant) {
        throw new NotFoundException('Tenant not found');
    }
    return tenant;
};

export const getPublicTenantService = async (tenantId: string): Promise<Partial<ITenant>> => {
    const tenant = await TenantModel.findById(tenantId).select('name slug logo').lean();
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
};

export const createTenantService = async (authenticatedUser: AuthUser, tenant: ITenant): Promise<ITenant> => {
    await isHaveAccess(authenticatedUser, null, "Tenant", "create");

    const newTenant = await TenantModel.create(tenant);
    return newTenant;
};

export const updateTenantService = async (authenticatedUser: AuthUser, tenantId: string, tenant: ITenant): Promise<ITenant> => {
    await isHaveAccess(authenticatedUser, null, "Tenant", "update");

    if (authenticatedUser.role !== "owner" && authenticatedUser.tenantId !== tenantId) {
        throw new ForbiddenException('You can only update your own tenant');
    }

    const updatedTenant = await TenantModel.findByIdAndUpdate(tenantId, tenant, { new: true }).lean();
    if (!updatedTenant) {
        throw new NotFoundException('Tenant not found');
    }
    return updatedTenant;
};

export const deleteTenantService = async (authenticatedUser: AuthUser, tenantId: string): Promise<ITenant> => {
    await isHaveAccess(authenticatedUser, null, "Tenant", "delete");

    if (authenticatedUser.role !== "owner" && authenticatedUser.tenantId !== tenantId) {
        throw new ForbiddenException('You do not have permission to delete this tenant');
    }

    const deletedTenant = await TenantModel.findByIdAndUpdate(tenantId, { status: "deleted" }, { new: true }).lean();
    if (!deletedTenant) {
        throw new NotFoundException('Tenant not found');
    }
    return deletedTenant;
};