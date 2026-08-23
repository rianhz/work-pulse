import { ITenant } from './interfaces';
import { TenantModel } from './schema';
import { NotFoundException } from '../../utils/app-error';
import { AuthUser } from '../authentication/interfaces';
import { isHaveAccess } from '../../utils/casl';

export const getTenantService = async (authenticatedUser: AuthUser, tenantId: string): Promise<ITenant> => {
  const tenant = await TenantModel.findOne({ 
    _id: tenantId, 
    status: { $ne: "deleted" } 
  }).lean();

  if (!tenant) {
    throw new NotFoundException('Tenant not found');
  }

  return tenant as unknown as ITenant;
};

export const getPublicTenantService = async (tenantId: string): Promise<Partial<ITenant>> => {
  const tenant = await TenantModel.findOne({ 
    _id: tenantId, 
    status: { $ne: "deleted" } 
  })
    .select('name slug logo status')
    .lean();

  if (!tenant) {
    throw new NotFoundException('Tenant not found');
  }

  return tenant as unknown as Partial<ITenant>;
};

export const createTenantService = async (authenticatedUser: AuthUser, tenant: ITenant): Promise<ITenant> => {
  await isHaveAccess(authenticatedUser, "Tenant", "create");

  const newTenant = await TenantModel.create(tenant);
  return newTenant as unknown as ITenant;
};

export const updateTenantService = async (
  authenticatedUser: AuthUser, 
  tenantId: string, 
  tenant: Partial<ITenant>
): Promise<ITenant> => {
  const existingTenant = await TenantModel.findOne({ 
    _id: tenantId, 
    status: { $ne: "deleted" } 
  }).lean();

  if (!existingTenant) {
    throw new NotFoundException('Tenant not found');
  }

  await isHaveAccess(authenticatedUser, "Tenant", "update", { 
    ...existingTenant, 
    tenantId: existingTenant._id.toString() 
  });

  const updatedTenant = await TenantModel.findByIdAndUpdate(
    tenantId, 
    { $set: tenant }, 
    { new: true }
  ).lean();

  if (!updatedTenant) {
    throw new NotFoundException('Tenant update failed');
  }

  return updatedTenant as unknown as ITenant;
};

export const deleteTenantService = async (
  authenticatedUser: AuthUser, 
  tenantId: string
): Promise<ITenant> => {
  const existingTenant = await TenantModel.findOne({ 
    _id: tenantId, 
    status: { $ne: "deleted" } 
  }).lean();

  if (!existingTenant) {
    throw new NotFoundException('Tenant not found');
  }

  await isHaveAccess(authenticatedUser, "Tenant", "delete", { 
    ...existingTenant, 
    tenantId: existingTenant._id.toString() 
  });

  const deletedTenant = await TenantModel.findByIdAndUpdate(
    tenantId, 
    { status: "deleted" }, 
    { new: true }
  ).lean();

  if (!deletedTenant) {
    throw new NotFoundException('Tenant deletion failed');
  }

  return deletedTenant as unknown as ITenant;
};