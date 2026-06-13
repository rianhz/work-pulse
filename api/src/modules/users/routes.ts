import { Router } from 'express';
import { addProjectToUserController, changePasswordController, getMeController, removeProjectFromUserController } from './controllers';
import { protectRoute } from '../../middleware/auth-middleware';

const router = Router();

router.get('/me', protectRoute, getMeController);
router.patch('/change-password', protectRoute, changePasswordController);
router.post('/add-project', protectRoute, addProjectToUserController);
router.patch('/remove-project', protectRoute, removeProjectFromUserController);

export const usersRoutes = router;