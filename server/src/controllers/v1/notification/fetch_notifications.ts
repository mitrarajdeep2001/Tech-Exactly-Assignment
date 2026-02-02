/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Services
 */
import { getNotificationsForUser } from '@/services/v1/notification/fetch_notifications';

/**
 * Types
 */
import type { Request, Response } from 'express';

const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId?.toString()!;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getNotificationsForUser({
      userId,
      page,
      limit,
    });

    res.status(200).json(result);
  } catch (err) {
    logger.error('Error fetching notifications', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

export default getNotifications;
