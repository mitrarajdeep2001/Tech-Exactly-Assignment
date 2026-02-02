/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Model
 */
import Comment from '@/models/comment';
import Blog from '@/models/blog';
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response } from 'express';

const getAnalytics = async (req: Request, res: Response): Promise<void> => {

  try {
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalBlogs,
      totalComments,
      totalUsers,
    });
  } catch (err) {
    // Handle unexpected error and respond with 500 Server Error
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error retrieving comments', err);
  }
};

export default getAnalytics;
