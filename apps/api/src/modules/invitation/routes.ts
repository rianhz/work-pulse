import { acceptInviteController, inviteUsersController, verifyInviteTokenController } from "./controller";
import { Router } from "express";
import { protectRoute } from "../../middleware/auth-middleware";

const router = Router();

router.post("/",protectRoute, inviteUsersController);
router.post("/accept", acceptInviteController);
router.get("/verify-token", verifyInviteTokenController);

export const invitationRoutes = router;