import { TenantModel } from './schemas';
import { ITenant } from './interfaces';

export const getTenant = async (tenantId: string): Promise<ITenant> => {
    const tenant = await TenantModel.findById(tenantId).lean();
    if (!tenant) {
        throw new Error('Tenant not found');
    }
    return tenant;
};
