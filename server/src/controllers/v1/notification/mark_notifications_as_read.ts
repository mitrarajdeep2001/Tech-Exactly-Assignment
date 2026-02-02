/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Services
 */
import markNotificationsAsRead from '@/services/v1/notification/mark_notification_as_read';

/**
 * Types
 */
import type { Request, Response } from 'express';

const markNotificationsAsReadController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.userId?.toString()!;
    const notificationId = req.params.notificationId; // optional

    const result = await markNotificationsAsRead({
      userId,
      notificationId,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    if (err.code === 'BadRequest') {
      res.status(400).json({
        code: 'BadRequest',
        message: err.message,
      });
      return;
    }

    if (err.code === 'NotFound') {
      res.status(404).json({
        code: 'NotFound',
        message: err.message,
      });
      return;
    }

    logger.error('Error marking notifications as read', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

export default markNotificationsAsReadController;
