import { Router } from "express";
import { protectRoute } from "../../middleware/auth-middleware";
import { getProjectsController, createProjectController, getProjectController, updateProjectController, deleteProjectController, getProjectsByBulkIdsController } from "./controller";

const router = Router();

router.get('/', protectRoute, getProjectsController);
router.post('/', protectRoute, createProjectController);
router.get('/:id', protectRoute, getProjectController);
router.post('/bulk', protectRoute, getProjectsByBulkIdsController);
router.put('/:id', protectRoute, updateProjectController);
router.delete('/:id', protectRoute, deleteProjectController);

export const projectsRoutes = router;