import { Router } from 'express';
import { registerController, loginController, logoutController, registerWithGoogleController, googleLoginController, removePasswordController, removeGoogleController, changePasswordController } from './controllers';
import { protectRoute } from '../../middleware/auth-middleware';

const router = Router();

router.post('/register', registerController);
router.post('/register/google', registerWithGoogleController);
router.post('/signin', loginController);
router.post('/signin/google', googleLoginController);
router.post('/logout', protectRoute, logoutController);
router.delete('/remove-password', protectRoute, removePasswordController);
router.delete('/remove-google', protectRoute, removeGoogleController);
router.patch('/change-password', protectRoute, changePasswordController);

export const authRoutes = router;