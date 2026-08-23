import { isHaveAccess } from "../../../utils/casl";
import { AUTH_PROVIDER_GOOGLE, AUTH_PROVIDER_EMAIL, LEAVE_TYPE_MARRIAGE_LEAVE, LEAVE_TYPE_MATERNITY_LEAVE, LEAVE_TYPE_PATERNITY_LEAVE } from "../../../utils/constant";
import { AuthUser } from "../../authentication/interfaces";
import { Plan } from "../../plan/schema";
import { ITenantSettings } from "./interfaces";
import { TenantSettings } from "./schema";

export const getTenantSettings = async (authenticatedUser: AuthUser, tenantId: string) => {
    // isHaveAccess(authenticatedUser, "TenantSettings", "manage", { tenantId });
    console.log(tenantId);
  
    const query = TenantSettings.findOne({ 
        tenantId: tenantId
     });

    if (authenticatedUser.role === "admin") {
      query.select("-billing");
    }
  
    const tenantSettings = await query.exec();
    return tenantSettings;
  };

export const updateTenantSettings = async (authenticatedUser: AuthUser, tenantId: string, tenantSettings: Partial<ITenantSettings>) => {
    isHaveAccess(authenticatedUser, "TenantSettings", "manage", { tenantId });
    const updatedTenantSettings = await TenantSettings.findOneAndUpdate({ tenantId }, tenantSettings, { new: true });
    return updatedTenantSettings;
};

export const createDefaultTenantSettings = async ({
  tenantId,
  companyName,
  slug,
  billingEmail,
}: {
  tenantId: string;
  companyName: string;
  slug: string;
  billingEmail: string;
}) => {
  // Fetch default plan for planSubscription
  const defaultPlan = await Plan.findOne({ isDefault: true }) || await Plan.findOne();
  if (!defaultPlan) {
    throw new Error("Default plan not found. Please seed or create a plan first.");
  }

  const now = new Date();
  const trialDays = 14;
  const trialEndsAt = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);

  return await TenantSettings.create({
    tenantId,
    branding: {
      name: companyName,
      slug,
      description: null,
      logo: null,
    },
    billing: {
      billingEmail: billingEmail.toLowerCase(),
      billingPhone: "-", // Default placeholder
    },
    leavePolicy: {
      description: "Default Statutory Leave Policy",
      types: [
        { type: new Map([[LEAVE_TYPE_MATERNITY_LEAVE, 90]]) },
        { type: new Map([[LEAVE_TYPE_PATERNITY_LEAVE, 14]]) },
        { type: new Map([[LEAVE_TYPE_MARRIAGE_LEAVE, 3]]) },
      ],
    },
    security: {
      allowedAuthProviders: [AUTH_PROVIDER_EMAIL, AUTH_PROVIDER_GOOGLE],
      password: {
        enabled: true,
        minLength: 8,
        requireSpecialCharacter: false,
        requireNumber: false,
        requireUppercase: false,
        requireLowercase: false,
      },
      email: {
        enabled: false,
        restrictedDomains: [],
      },
    },
    timezone: "UTC",
    planSubscription: {
      planId: defaultPlan._id,
      status: "TRIALING",
      trialEndsAt,
      currentPeriodStart: now,
      currentPeriodEnd: trialEndsAt,
    },
  });
};