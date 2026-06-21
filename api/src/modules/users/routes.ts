import { Router } from 'express';
import { addProjectToUserController, getMeController, getMeProvidersController, getUsersController, removeProjectFromUserController, updateUserController } from './controllers';
import { protectRoute } from '../../middleware/auth-middleware';

const router = Router();

router.get('/', protectRoute, getUsersController);
router.get('/me', protectRoute, getMeController);
router.get('/me/providers', protectRoute, getMeProvidersController);
router.post('/add-project', protectRoute, addProjectToUserController);
router.patch('/remove-project', protectRoute, removeProjectFromUserController);
router.put('/update/:userId', protectRoute, updateUserController);

export const usersRoutes = router;