
import mongoose from "mongoose";
import { IIdentity } from "./interfaces";

const identitySchema = new mongoose.Schema<IIdentity>( {
  userId: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  providerUserId: {
    type: String,
  },
  passwordHash: {
    type: String,
  },
  email: {
    type: String,
  },
}, {
  timestamps: true,
});

identitySchema.index(
  { provider: 1, providerUserId: 1 },
  { unique: true, sparse: true }
);

export const IdentityModel = mongoose.model<IIdentity>("Identity", identitySchema);