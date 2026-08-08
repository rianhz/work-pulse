import crypto from "crypto";
import mongoose from "mongoose";
import { UserModel } from "../users/schema";
import { InvitationModel } from "./schema";
import { BadRequestException, NotFoundException, ForbiddenException } from "../../utils/app-error";
import { hashValue } from "../../utils/bcrypt";
import { IdentityModel } from "../idp/schema";
import { IAcceptInvitePayload, IInviteUsersPayload } from "./interfaces";
import { sendInviteEmail } from "../../utils/email";
import { Env } from "../../config/env-config";
import { TenantModel } from "../tenants/schema";
import { AuthUser } from "../authentication/interfaces";
import { isHaveAccess } from "../../utils/casl";

export const inviteUsersService = async (
  authenticatedUser: AuthUser, 
  payload: Omit<IInviteUsersPayload, "tenantId">
): Promise<{ success: string[]; failed: { email: string; reason: string }[] }> => {
  const { emails, role } = payload;
  const { tenantId } = authenticatedUser;

  await isHaveAccess(authenticatedUser, null, "Invitation", "create");

  if (authenticatedUser.role !== "owner" && role === "admin") {
    throw new ForbiddenException("You are not authorized to invite users with the 'owner' role.");
  }

  const tenant = await TenantModel.findById(tenantId).lean();
  if (!tenant) throw new NotFoundException("Tenant not found");
  
  const success: string[] = [];
  const failed: { email: string; reason: string }[] = [];

  for (const email of emails) {
    const formattedEmail = email.toLowerCase().trim();

    try {
      const existingUser = await UserModel.findOne({ email: formattedEmail, tenantId }).lean();
      if (existingUser) {
        failed.push({ email, reason: "User is already a member of this tenant" });
        continue;
      }

      const token = crypto.randomBytes(32).toString("hex");

      await InvitationModel.findOneAndUpdate(
        { email: formattedEmail, tenantId },
        {
          role,
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        { upsert: true, new: true }
      );

      const inviteUrl = `${Env.FRONTEND_URL}/accept-invitation?token=${token}`;
      await sendInviteEmail({ toEmail: formattedEmail, inviteUrl, tenantName: tenant.name });

      success.push(formattedEmail);
    } catch (error: any) {
      failed.push({ email, reason: error.message || "Failed to process invitation" });
    }
  }

  return { success, failed };
};

export const acceptInviteService = async (payload: IAcceptInvitePayload): Promise<any> => {
  const { token, fullName, password } = payload;

  const invitation = await InvitationModel.findOne({ token });
  if (!invitation) {
    throw new BadRequestException("Invalid or expired invitation token.");
  }

  if (new Date() > invitation.expiresAt) {
    await InvitationModel.deleteOne({ _id: invitation._id });
    throw new BadRequestException("Invitation link has expired.");
  }

  const existingUser = await UserModel.findOne({ email: invitation.email, tenantId: invitation.tenantId }).lean();
  if (existingUser) {
    throw new BadRequestException("An account with this email already exists in this workspace.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [user] = await UserModel.create(
      [
        {
          email: invitation.email,
          tenantId: invitation.tenantId,
          fullName,
          role: invitation.role,
          status: "active",
        },
      ],
      { session }
    );

    const passwordHash = await hashValue(password, 10);
    await IdentityModel.create(
      [
        {
          userId: user._id.toString(),
          provider: "password",
          passwordHash,
          providerUserId: user.email.toLowerCase(),
          email: user.email.toLowerCase(),
        },
      ],
      { session }
    );

    await InvitationModel.deleteOne({ _id: invitation._id }, { session });

    await session.commitTransaction();
    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const verifyInviteTokenService = async (token: string): Promise<{ email: string, tenantId: string, role: string }> => {
  const invitation = await InvitationModel.findOne({ token });
  
  if (!invitation) {
    throw new BadRequestException("Invalid invitation token.");
  }

  if (new Date() > invitation.expiresAt) {
    await InvitationModel.deleteOne({ _id: invitation._id });
    throw new BadRequestException("Invitation link has expired.");
  }

  return { email: invitation.email, tenantId: invitation.tenantId, role: invitation.role };
};