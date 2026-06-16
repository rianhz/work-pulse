import { TenantModel } from './schema';
import { ITenant } from './interfaces';
import { NotFoundException } from '../../utils/app-error';
import { isHaveAccess } from '../../utils/casl';
import { AuthUser } from '../authentication/interfaces';

export const getTenantService = async (tenantId: string): Promise<ITenant> => {
    const tenant = await TenantModel.findById(tenantId).lean();
    if (!tenant) {
        throw new NotFoundException('Tenant not found');
    }
    return tenant;
};

export const createTenantService = async (tenant: ITenant): Promise<ITenant> => {
    const newTenant = await TenantModel.create(tenant);
    return newTenant;
};

export const updateTenantService = async (authenticatedUser: AuthUser, tenantId: string, tenant: ITenant): Promise<ITenant> => {
    await isHaveAccess(authenticatedUser, tenantId, "update", "Tenant");
    
    const updatedTenant = await TenantModel.findByIdAndUpdate(tenantId, tenant, { new: true }).lean();
    if (!updatedTenant) {
        throw new NotFoundException('Tenant not found');
    }
    return updatedTenant;
};

export const deleteTenantService = async (authenticatedUser: AuthUser, tenantId: string): Promise<ITenant> => {
    await isHaveAccess(authenticatedUser, tenantId, "delete", "Tenant");
    
    const deletedTenant = await TenantModel.findByIdAndUpdate(tenantId, { status: "deleted" }, { new: true }).lean();
    if (!deletedTenant) {
        throw new NotFoundException('Tenant not found');
    }
    return deletedTenant;
}