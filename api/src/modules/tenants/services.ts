import { TenantModel } from './schema';
import { ITenant } from './interfaces';
import { NotFoundException } from '../../utils/app-error';

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

export const updateTenantService = async (tenantId: string, tenant: ITenant): Promise<ITenant> => {
    const updatedTenant = await TenantModel.findByIdAndUpdate(tenantId, tenant, { new: true }).lean();
    if (!updatedTenant) {
        throw new NotFoundException('Tenant not found');
    }
    return updatedTenant;
};

export const deleteTenantService = async (tenantId: string): Promise<ITenant> => {
    const deletedTenant = await TenantModel.findByIdAndDelete(tenantId).lean();
    if (!deletedTenant) {
        throw new NotFoundException('Tenant not found');
    }
    return deletedTenant;
}