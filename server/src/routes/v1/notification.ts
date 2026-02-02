/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Controllers
 */
import getNotifications from '@/controllers/v1/notification/fetch_notifications';

/**
 * Middleware
 */
import authenticate from '@/middlewares/authenticate';
import markNotificationsAsReadController from '@/controllers/v1/notification/mark_notifications_as_read';

const router = Router();

/**
 * GET /notifications
 * Fetch logged-in user's notifications
 */
router.get('/', authenticate, getNotifications);

/**
 * PATCH /notifications/read
 * Mark ALL as read
 */
router.patch('/read', authenticate, markNotificationsAsReadController);

/**
 * PATCH /notifications/:notificationId/read
 * Mark SINGLE as read
 */
router.patch(
  '/:notificationId/read',
  authenticate,
  markNotificationsAsReadController,
);

export default router;
