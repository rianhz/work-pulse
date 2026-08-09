import { Router } from "express";
import { getNotificationsController, getUnreadNotificationsCountController, markAllNotificationsAsReadController, markNotificationAsReadController } from "./controllers";
import { protectRoute } from "../../middleware/auth-middleware";

const notificationRoutes = Router();

notificationRoutes.get("/", protectRoute, getNotificationsController);
notificationRoutes.get("/unread-count", protectRoute, getUnreadNotificationsCountController);
notificationRoutes.post("/mark-as-read", protectRoute, markNotificationAsReadController);
notificationRoutes.post("/mark-all-as-read", protectRoute, markAllNotificationsAsReadController);

export default notificationRoutes;