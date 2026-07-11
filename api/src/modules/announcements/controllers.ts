import { Request, Response } from "express";
import { createAnnouncementService, getAnnouncementsService, deleteAnnouncementService, updateAnnouncementService, getAnnouncementByIdService } from "./services";
import { HTTPSTATUS } from "../../utils/http-config";

export const createAnnouncementController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const { title, description, type, thumbnail, cover, content } = req.body;
  const payload = {
    title,
    description,
    type,
    thumbnail,
    cover,
    content,
    tenantId: authenticatedUser.tenantId,
    status: "draft" as "published" | "draft" | "archived" | "deleted",
  }
  
  const newAnnouncement = await createAnnouncementService(authenticatedUser, payload);
  res.status(HTTPSTATUS.CREATED).json({ success: true, data: {
    id: newAnnouncement._id,
  } });
};

export const getAnnouncementsController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const search = req.query.search as string || "";
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const { data, total } = await getAnnouncementsService(authenticatedUser, authenticatedUser.tenantId, { search, page, limit });
  res.status(200).json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
};

export const getAnnouncementByIdController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const announcement = await getAnnouncementByIdService(authenticatedUser, req.params.id as string);
  res.status(200).json(announcement);
};

export const updateAnnouncementController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const { title, description, type, status, thumbnail, cover, content } = req.body;
  const payload = {
    title,
    description,
    type,
    tenantId: authenticatedUser.tenantId,
    status,
    thumbnail,
    cover,
    content,
  }
  const announcement = await updateAnnouncementService(authenticatedUser, req.params.id as string, payload);
  res.status(200).json(announcement);
};

export const deleteAnnouncementController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const announcement = await deleteAnnouncementService(authenticatedUser, req.params.id as string);
  res.status(200).json(announcement);
};