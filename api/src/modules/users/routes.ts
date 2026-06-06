import { Router } from 'express';
import { getMeController } from './controllers';

const router = Router();

router.get('/me', getMeController);

export const usersRoutes = router;