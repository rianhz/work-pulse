import { Request, Response } from "express";
import { getHomeAnnouncementsService } from "./services";

export const getHomeAnnouncementsController = async (req: Request, res: Response) => {
  const authenticatedUser = (req as any).user;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const { data, pagination } = await getHomeAnnouncementsService(authenticatedUser, { search: "", page, limit });
  res.status(200).json({ success: true, data, pagination });
}