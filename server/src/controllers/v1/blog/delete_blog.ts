/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Services
 */
import { deleteBlogService } from '@/services/v1/blog/delete_blog';

/**
 * Types
 */
import type { Request, Response } from 'express';

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as unknown as string;
    const blogId = req.params.blogId;

    await deleteBlogService({
      blogId,
      userId,
    });

    res.sendStatus(204);
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

    logger.error('Error during blog deletion', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

export default deleteBlog;
