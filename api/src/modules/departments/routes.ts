import { Router } from "express";
import { protectRoute } from "../../middleware/auth-middleware";
import { createDepartmentController, getDepartmentsController, getDepartmentController, updateDepartmentController, deleteDepartmentController, disableDepartmentController, enableDepartmentController } from "./controllers";

const router = Router();

router.post('/', protectRoute, createDepartmentController);
router.get('/', protectRoute, getDepartmentsController);
router.get('/:id', protectRoute, getDepartmentController);
router.put('/:id', protectRoute, updateDepartmentController);
router.patch('/delete/:id', protectRoute, deleteDepartmentController);
router.patch('/disable/:id', protectRoute, disableDepartmentController);
router.patch('/enable/:id', protectRoute, enableDepartmentController);

export const departmentRoutes = router;