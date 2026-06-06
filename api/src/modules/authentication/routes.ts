import { Router } from 'express';
import { registerController, loginController, googleCallbackController, logoutController, meController } from './controllers';
import { protectRoute } from '../../middleware/auth-middleware';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', protectRoute, logoutController);
router.get('/me', protectRoute, meController);
router.get('/google/callback', googleCallbackController);

export const authRoutes = router;