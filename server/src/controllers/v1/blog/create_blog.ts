/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Services
 */
import { createBlogService } from '@/services/v1/blog/create_blog';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IBlog } from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, banner, status } = req.body as BlogData;
    const authorId = req.body.authorId || req.userId;

    const blog = await createBlogService({
      title,
      content,
      banner,
      status,
      authorId,
    });

    res.status(201).json({
      blog,
    });
  } catch (err) {
    logger.error('Error during blog creation', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

export default createBlog;
