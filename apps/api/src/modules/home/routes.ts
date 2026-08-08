import { Router } from "express";
import { getHomeAnnouncementsController } from "./controllers";
import { protectRoute } from "../../middleware/auth-middleware";

const router = Router();

router.get("/", protectRoute, getHomeAnnouncementsController);

export const homeRoutes = router;