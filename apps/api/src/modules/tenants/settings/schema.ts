import { Schema, model } from "mongoose";
import { 
  AUTH_PROVIDER_EMAIL, 
  AUTH_PROVIDER_GOOGLE, 
  LEAVE_TYPE_MATERNITY_LEAVE, 
  LEAVE_TYPE_PATERNITY_LEAVE, 
  LEAVE_TYPE_MARRIAGE_LEAVE 
} from "../../../utils/constant";

// Sub-schemas
const LeavePolicySchema = new Schema(
  {
    type: {
      type: Map,
      of: Number,
      required: true,
      validate: {
        validator: function (v: Map<string, number>) {
          const validKeys = [
            LEAVE_TYPE_MATERNITY_LEAVE,
            LEAVE_TYPE_PATERNITY_LEAVE,
            LEAVE_TYPE_MARRIAGE_LEAVE,
          ];
          return Array.from(v.keys()).every((key) => validKeys.includes(key as typeof LEAVE_TYPE_MATERNITY_LEAVE | typeof LEAVE_TYPE_PATERNITY_LEAVE | typeof LEAVE_TYPE_MARRIAGE_LEAVE));
        },
        message: (props: any) => `${props.value} contains invalid leave type keys!`,
      },
    },
  },
  { _id: false }
);

const SecuritySchema = new Schema(
  {
    allowedAuthProviders: {
      type: [String],
      enum: [AUTH_PROVIDER_EMAIL, AUTH_PROVIDER_GOOGLE],
      required: true,
      default: [AUTH_PROVIDER_EMAIL],
    },
    password: {
      enabled: { type: Boolean, required: true, default: true },
      minLength: { type: Number, required: true, default: 8 },
      requireSpecialCharacter: { type: Boolean, required: true, default: false },
      requireNumber: { type: Boolean, required: true, default: false },
      requireUppercase: { type: Boolean, required: true, default: false },
      requireLowercase: { type: Boolean, required: true, default: false },
    },
    email: {
      enabled: { type: Boolean, required: true, default: false },
      restrictedDomains: {
        type: [String],
        default: [],
        set: (domains: string[]) =>
          domains.map((d) => d.trim().toLowerCase()), // Sanitizes domain strings
      },
    },
  },
  { _id: false }
);

const BillingSchema = new Schema(
  {
    billingEmail: { type: String, required: true, trim: true, lowercase: true },
    billingPhone: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const BrandingSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    logo: { type: String, default: null },
    slug: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// Main Tenant Settings Schema
const TenantSettingsSchema = new Schema(
  {
    tenantId: {
      type: String,
      required: true,
    },
    leavePolicy: {
      type: {
        description: { type: String, required: false, default: "" },
        types: [LeavePolicySchema],
      },
      default: [],
    },
    security: {
      type: SecuritySchema,
      required: true,
    },
    billing: {
      type: BillingSchema,
      required: true,
    },
    branding: {
      type: BrandingSchema,
      required: true,
    },
    timezone: {
      type: String,
      required: false,
      default: "",
    },
    planSubscription: {
        planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
        status: { 
            type: String, 
            enum: ["ACTIVE", "PAST_DUE", "CANCELED", "TRIALING"], 
            default: "TRIALING" 
        },
        trialEndsAt: { type: Date },
        currentPeriodStart: { type: Date },
        currentPeriodEnd: { type: Date },
    }
  },
  {
    timestamps: true,
  }
);

export const TenantSettings = model("TenantSettings", TenantSettingsSchema);