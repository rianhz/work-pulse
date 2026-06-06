import mongoose from "mongoose";
import { ITenant } from "./interfaces";


const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    plan: {
      type: String,
      default: "trial",
    },

    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

tenantSchema.index(
  { slug: 1 },
  { unique: true }
);

export const TenantModel = mongoose.model<ITenant>("Tenant", tenantSchema);