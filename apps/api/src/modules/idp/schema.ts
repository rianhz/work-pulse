
import mongoose from "mongoose";
import { IIdentity } from "./interfaces";

const identitySchema = new mongoose.Schema<IIdentity>( {
  userId: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    enum: ['password', 'google'],
    default: 'password',
    required: true,
  },
  providerUserId: {
    type: String,
    required: false,
    default: null,
  },
  passwordHash: {
    type: String,
    required: false,
    default: null,
  },
  email: {
    type: String,
    required: false,
    default: null,
  },
}, {
  timestamps: true,
});

identitySchema.index(
  { provider: 1, providerUserId: 1 },
  { unique: true, sparse: true }
);

identitySchema.index(
  { userId: 1, provider: 1 },
  { unique: true }
);

export const IdentityModel = mongoose.model<IIdentity>("Identity", identitySchema);