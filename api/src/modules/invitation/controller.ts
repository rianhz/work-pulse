import { Request, Response } from "express";
import { acceptInviteService, inviteUsersService, verifyInviteTokenService } from "./service";
import { asyncHandler } from "../../middleware/async-handler";
import { HTTPSTATUS } from "../../utils/http-config";
import { isHaveAccess } from "../../utils/casl";
import { BadRequestException } from "../../utils/app-error";

export const inviteUsersController = asyncHandler(async (req: Request, res: Response) => {
  const { emails, role } = req.body;
  const authenticatedUser = (req as any).user;
  const { tenantId } = authenticatedUser;

  await isHaveAccess(authenticatedUser, null, "Invitation", "create");

  const { success, failed } = await inviteUsersService({ emails, role, tenantId });
  res.status(HTTPSTATUS.OK).json({ success, failed });
});

export const acceptInviteController = asyncHandler(async (req: Request, res: Response) => {
  const { token, fullName, password } = req.body;

  await acceptInviteService({ token, fullName, password });

  res.status(HTTPSTATUS.CREATED).json({ 
    message: "Invitation accepted successfully",
  });
});

export const verifyInviteTokenController = asyncHandler(async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    throw new BadRequestException("Token is required");
  }

  const result = await verifyInviteTokenService(token);
  res.status(HTTPSTATUS.OK).json(result);
});