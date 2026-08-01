import { Request, Response } from "express";
import { getLeaveBalance, getMyLeaveBalance, updateLeaveBalance } from "./services";
import { HTTPSTATUS } from "../../../utils/http-config";

export const updateLeaveBalanceController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const { userId, balance } = req.body;
  await updateLeaveBalance(authenticatedUser, userId, balance);
  res.status(HTTPSTATUS.OK).json({ success: true, message: "Leave balance updated successfully" });
}

export const getLeaveBalanceController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const { userId } = req.params;
  const leaveBalance = await getLeaveBalance(authenticatedUser, userId as string);
  res.status(HTTPSTATUS.OK).json({ success: true, data: leaveBalance });
}

export const getMyLeaveBalanceController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const leaveBalance = await getMyLeaveBalance(authenticatedUser);
  res.status(HTTPSTATUS.OK).json({ success: true, data: leaveBalance });
}