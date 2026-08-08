import { Router } from 'express';
import { protectRoute } from '../../middleware/auth-middleware';
import { getTenantController, createTenantController, updateTenantController, deleteTenantController, getPublicTenantController } from './controllers';

const router = Router();

router.post('/', protectRoute, createTenantController);
router.put('/:id', protectRoute, updateTenantController);
router.get('/public/:id', getPublicTenantController);
router.get('/:id', protectRoute, getTenantController);
router.delete('/:id', protectRoute, deleteTenantController);

export const tenantsRoutes = router;