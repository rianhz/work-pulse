import { Router } from 'express';
import { registerController, loginController, logoutController } from './controllers';
import { protectRoute } from '../../middleware/auth-middleware';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', protectRoute, logoutController);

export const authRoutes = router;