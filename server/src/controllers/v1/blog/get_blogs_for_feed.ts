/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Services
 */
import { getBlogs } from '@/services/v1/blog/get_blogs';

/**
 * Types
 */
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

const getAllBlogsForFeed = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await getBlogs({
      userId: req.userId,
      blogId: req.query.blogId as Types.ObjectId | undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    });

    res.status(200).json(result);
  } catch (err) {
    logger.error('Error while fetching blogs with comments', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

export default getAllBlogsForFeed;
