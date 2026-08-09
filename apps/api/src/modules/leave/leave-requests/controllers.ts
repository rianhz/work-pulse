import { Request, Response } from "express";
import { createLeaveRequestService, getLeaveRequestsService, updateLeaveRequestService, deleteLeaveRequestService, getMyLeaveRequestsService, getLeaveRequestByIdService, approveLeaveRequestService, rejectLeaveRequestService } from "./services";
import { HTTPSTATUS } from "../../../utils/http-config";

export const getLeaveRequests = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const search = req.query.search as string || "";
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const leaveRequests = await getLeaveRequestsService(authenticatedUser, { search, page, limit });
  res.status(HTTPSTATUS.OK).json({ success: true, data: leaveRequests.data, pagination: { page, limit, total: leaveRequests.total, totalPages: Math.ceil(leaveRequests.total / limit) } });
}

export const getMyLeaveRequests = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const search = req.query.search as string || "";
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const { data, total } = await getMyLeaveRequestsService(authenticatedUser, { search, page, limit });
  res.status(HTTPSTATUS.OK).json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export const createLeaveRequest = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  await createLeaveRequestService(authenticatedUser, req.body);
  res.status(HTTPSTATUS.CREATED).json({ success: true, message: "Leave request created successfully" });
}

export const updateLeaveRequest = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  await updateLeaveRequestService(authenticatedUser, req.params.id as string, req.body);
  res.status(HTTPSTATUS.OK).json({ success: true, message: "Leave request updated successfully" });
}

export const deleteLeaveRequest = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  await deleteLeaveRequestService(authenticatedUser, req.params.id as string);
  res.status(HTTPSTATUS.OK).json({ success: true, message: "Leave request deleted successfully" });
}

export const getLeaveRequestById = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const leaveRequest = await getLeaveRequestByIdService(authenticatedUser, req.params.id as string);
  res.status(HTTPSTATUS.OK).json({ success: true, data: leaveRequest });
}

export const approveLeaveRequest = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  await approveLeaveRequestService(authenticatedUser, req.params.id as string);
  res.status(HTTPSTATUS.OK).json({ success: true, message: "Leave request approved successfully" });
}

export const rejectLeaveRequest = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  await rejectLeaveRequestService(authenticatedUser, req.params.id as string, { rejectionReason: req.body.rejectionReason as string });
  res.status(HTTPSTATUS.OK).json({ success: true, message: "Leave request rejected successfully" });
}