import { LEAVE_TYPE_MATERNITY_LEAVE, LEAVE_TYPE_PATERNITY_LEAVE, LEAVE_TYPE_MARRIAGE_LEAVE } from "@/helpers/constants";
import { AUTH_PROVIDER_EMAIL, AUTH_PROVIDER_GOOGLE } from "@/helpers/constants";

export interface ILeavePolicy {
    type: Record<typeof LEAVE_TYPE_MATERNITY_LEAVE | typeof LEAVE_TYPE_PATERNITY_LEAVE | typeof LEAVE_TYPE_MARRIAGE_LEAVE, number>;
}


export interface ISecurity {
    allowedAuthProviders: (typeof AUTH_PROVIDER_EMAIL | typeof AUTH_PROVIDER_GOOGLE)[];
    password: {
        enabled: boolean;
        minLength: number;
        requireSpecialCharacter: boolean;
        requireNumber: boolean;
        requireUppercase: boolean;
        requireLowercase: boolean;
    };
    email:{
        enabled: boolean;
        restrictedDomains: string[];
    };
}

export interface IBilling {
    billingEmail: string;
    billingPhone: string;
}


export interface IBranding {
    name: string;
    description: string | null;
    logo: string | null;
    slug: string;
}

export interface ITenantSettings {
    tenantId: string;
    leavePolicy: {
        description: string;
        types: ILeavePolicy[];
    };
    security: ISecurity;
    billing: IBilling;
    branding: IBranding;
    timezone: string;
    planSubscription: {
        planId: string;
        status: "ACTIVE" | "PAST_DUE" | "CANCELED" | "TRIALING";
        trialEndsAt: Date;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
    };
}