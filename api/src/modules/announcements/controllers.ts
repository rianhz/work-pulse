import { Request, Response } from "express";
import { createAnnouncementService, getAnnouncementsService, deleteAnnouncementService, updateAnnouncementService, getAnnouncementByIdService } from "./services";
import { HTTPSTATUS } from "../../utils/http-config";

export const createAnnouncementController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const { title, description, imageUrl, type } = req.body;
  const payload = {
    title,
    description,
    imageUrl,
    type,
    tenantId: authenticatedUser.tenantId,
    status: "active" as "active" | "inactive" | "deleted",
  }
  
  await createAnnouncementService(authenticatedUser, payload);
  res.status(HTTPSTATUS.CREATED).json({ success: true });
};

export const getAnnouncementsController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const announcements = await getAnnouncementsService(authenticatedUser, authenticatedUser.tenantId);
  res.status(200).json(announcements);
};

export const getAnnouncementByIdController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const announcement = await getAnnouncementByIdService(authenticatedUser, req.params.id as string);
  res.status(200).json(announcement);
};

export const updateAnnouncementController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const { title, description, imageUrl, type, status } = req.body;
  const payload = {
    title,
    description,
    imageUrl,
    type,
    tenantId: authenticatedUser.tenantId,
    status,
  }
  const announcement = await updateAnnouncementService(authenticatedUser, req.params.id as string, payload);
  res.status(200).json(announcement);
};

export const deleteAnnouncementController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const announcement = await deleteAnnouncementService(authenticatedUser, req.params.id as string);
  res.status(200).json(announcement);
};