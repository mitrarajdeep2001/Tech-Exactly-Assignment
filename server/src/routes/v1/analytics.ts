
/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';

/**
 * Controllers
 */
import getAnalytics from '@/controllers/v1/analytics/analytics';

const router = Router();

router.get('/', authenticate, authorize(['admin']), getAnalytics);

export default router;
