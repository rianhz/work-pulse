import { Request, Response } from "express";
import { getUnreadCountService, markAsReadService, markAllAsReadService, getMineService, createNotificationService } from "./services";
import { HTTPSTATUS } from "../../utils/http-config";
import { AuthUser } from "../../modules/authentication/interfaces";

export const getNotificationsController = async (
  req: Request,
  res: Response
) => {
  const authenticatedUser = (req as any).user as AuthUser;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const notifications = await getMineService(authenticatedUser, { page, limit });

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: notifications.data,
    pagination: {
      page,
      limit,
      total: notifications.total,
      totalPages: Math.ceil(notifications.total / limit),
    },
  });
};

export const getUnreadNotificationsCountController = async (
  req: Request,
  res: Response
) => {
  const authenticatedUser = (req as any).user as AuthUser;

  const count = await getUnreadCountService(authenticatedUser);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    unread: count,
  });
};

export const markNotificationAsReadController = async (
  req: Request,
  res: Response
) => {

  const authenticatedUser = (req as any).user as AuthUser;

  await markAsReadService(req.params.id as string, authenticatedUser);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: `Notification marked as read`,
  });
};

export const markAllNotificationsAsReadController = async (
  req: Request,
  res: Response
) => {

  const authenticatedUser = (req as any).user as AuthUser;

  const updatedCount = await markAllAsReadService(authenticatedUser);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: `${updatedCount} notifications marked as read`,
  });
};