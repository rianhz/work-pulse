import { Router } from "express";
import { createAnnouncementController, getAnnouncementByIdController, updateAnnouncementController, deleteAnnouncementController, getAnnouncementsController } from "./controllers";
import { protectRoute } from "../../middleware/auth-middleware";

const router = Router();

router.post("/",protectRoute, createAnnouncementController);
router.get("/", protectRoute, getAnnouncementsController);
router.get("/:id", protectRoute, getAnnouncementByIdController);
router.put("/:id", protectRoute, updateAnnouncementController);
router.delete("/:id", protectRoute, deleteAnnouncementController);

export const announcementsRoutes = router;

