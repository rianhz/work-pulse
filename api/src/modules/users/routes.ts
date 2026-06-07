import { Router } from 'express';
import { changePasswordController, getMeController } from './controllers';
import { protectRoute } from '../../middleware/auth-middleware';

const router = Router();

router.get('/me', protectRoute, getMeController);
router.patch('/change-password', protectRoute, changePasswordController);

export const usersRoutes = router;