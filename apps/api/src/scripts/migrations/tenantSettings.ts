import { Plan } from "../../modules/plan/schema";
import { TenantModel } from "../../modules/tenants/schema";
import { TenantSettings } from "../../modules/tenants/settings/schema";
import { 
  AUTH_PROVIDER_EMAIL, 
  LEAVE_TYPE_MATERNITY_LEAVE, 
  LEAVE_TYPE_PATERNITY_LEAVE, 
  LEAVE_TYPE_MARRIAGE_LEAVE 
} from "../../utils/constant";

export async function populateTenantSettings() {
  console.log("Starting TenantSettings migration...");

  // 1. Fetch default plan or create a fallback default plan if database is empty
  let defaultPlan = await Plan.findOne({}).lean();

  if (!defaultPlan) {
    console.log("No existing plans found. Creating default Free Plan...");
    defaultPlan = await Plan.create({
      code: "TRIAL",
      name: "Free Plan",
      description: "Default free plan created by system migration",
      limits: {
        maxEmployees: 10,
      },
      isActive: true,
    });
  }

  const tenants = await TenantModel.find({}).lean();
  console.log(`Found ${tenants.length} tenants in database.`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const tenant of tenants) {
    const existingSettings = await TenantSettings.findOne({ tenantId: tenant._id });

    if (existingSettings) {
      skippedCount++;
      continue;
    }

    const tenantName = (tenant as any).name || "";
    const tenantSlug = (tenant as any).slug || "";

    await TenantSettings.create({
      tenantId: tenant._id,
      branding: {
        name: tenantName,
        slug: tenantSlug,
        description: "Default tenant organization settings.",
        logo: null,
      },
      billing: {
        billingEmail: (tenant as any).email || "billing@example.com",
        billingPhone: "+1000000000",
      },
      security: {
        allowedAuthProviders: [AUTH_PROVIDER_EMAIL],
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
      leavePolicy: {
        description: "Default statutory leave policies",
        types: [
          { type: new Map([[LEAVE_TYPE_MATERNITY_LEAVE, 90]]) },
          { type: new Map([[LEAVE_TYPE_PATERNITY_LEAVE, 14]]) },
          { type: new Map([[LEAVE_TYPE_MARRIAGE_LEAVE, 3]]) },
        ],
      },
      timezone: "UTC",
      // Include the required planSubscription payload
      planSubscription: {
        planId: defaultPlan._id,
        status: "TRIALING",
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    createdCount++;
  }

  console.log(`Migration Complete -> Created: ${createdCount}, Skipped: ${skippedCount}`);
  return { createdCount, skippedCount };
}