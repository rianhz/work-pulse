import { Router } from 'express';
import { addProjectToUserController, getMeController, getMeProjectsController, getMeProvidersController, getUsersController, removeProjectFromUserController, searchUsersController, updateUserController } from './controllers';
import { protectRoute } from '../../middleware/auth-middleware';

const router = Router();

router.get('/', protectRoute, getUsersController);
router.get('/me', protectRoute, getMeController);
router.get('/me/providers', protectRoute, getMeProvidersController);
router.get('/me/projects', protectRoute, getMeProjectsController);
router.post('/add-project', protectRoute, addProjectToUserController);
router.patch('/remove-project', protectRoute, removeProjectFromUserController);
router.put('/update/:userId', protectRoute, updateUserController);
router.get('/search', protectRoute, searchUsersController);

export const usersRoutes = router;