import { Router } from "express";
import { createPositionController, getPositionsController, getPositionController, updatePositionController, deletePositionController, disablePositionController, enablePositionController } from "./controllers";
import { protectRoute } from "../../middleware/auth-middleware";

const router = Router();

router.post('/', protectRoute, createPositionController);
router.get('/', protectRoute, getPositionsController);
router.get('/:id', protectRoute, getPositionController);
router.put('/:id', protectRoute, updatePositionController);
router.delete('/:id', protectRoute, deletePositionController);
router.put('/:id/disable', protectRoute, disablePositionController);
router.put('/:id/enable', protectRoute, enablePositionController);

export const positionRoutes = router;