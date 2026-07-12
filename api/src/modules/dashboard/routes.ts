import { Router } from "express";
import { getDashboardAnnouncementsController } from "./controllers";
import { protectRoute } from "../../middleware/auth-middleware";

const router = Router();

router.get("/", protectRoute, getDashboardAnnouncementsController);

export const dashboardRoutes = router;