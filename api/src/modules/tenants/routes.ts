import { Router } from 'express';
import { protectRoute } from '../../middleware/auth-middleware';
import { getTenantController, createTenantController, updateTenantController, deleteTenantController } from './controllers';

const router = Router();

router.get('/', protectRoute, getTenantController);
router.post('/', protectRoute, createTenantController);
router.put('/', protectRoute, updateTenantController);
router.delete('/', protectRoute, deleteTenantController);

export const tenantsRoutes = router;