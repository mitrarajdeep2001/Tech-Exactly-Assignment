/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Services
 */
import { createCommentService } from '@/services/v1/comment/create_comment';

/**
 * Types
 */
import type { Request, Response } from 'express';

type RequestBody = {
  content: string;
};

type RequestParams = {
  blogId: string;
};

const createComment = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params as RequestParams;
  const { content } = req.body as RequestBody;
  const userId = req.userId as unknown as string;

  try {
    const comment = await createCommentService({
      blogId,
      content,
      userId,
    });

    res.status(201).json(comment);
  } catch (err: any) {
    if (err.code === 'NotFound') {
      res.status(404).json({
        code: 'NotFound',
        message: err.message,
      });
      return;
    }

    logger.error('Error during comment creation in blog', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

export default createComment;
