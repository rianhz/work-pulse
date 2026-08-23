import { Router } from "express";
import { getTenantSettingsController, updateTenantSettingsController } from "./controllers";
import { protectRoute } from "../../../middleware/auth-middleware";

const router = Router();

router.get("/:id",protectRoute, getTenantSettingsController);
router.put("/:id",protectRoute, updateTenantSettingsController);

export const tenantSettingsRoutes = router;