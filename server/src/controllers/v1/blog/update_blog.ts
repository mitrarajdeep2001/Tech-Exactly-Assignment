/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Services
 */
import { updateBlogService } from '@/services/v1/blog/update_blog';

/**
 * Types
 */
import type { Request, Response } from 'express';

const updateBlog = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      banner,
      status,
      removeBanner,
    } = req.body;

    const userId = req.body.authorId || req.userId;
    const blogId = req.params.blogId;

    const blog = await updateBlogService({
      blogId,
      userId,
      title,
      content,
      banner,
      status,
      removeBanner,
    });

    res.status(200).json({
      blog,
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

    if (err.code === 'AuthorizationError') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: err.message,
      });
      return;
    }

    logger.error('Error while updating blog', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

export default updateBlog;
