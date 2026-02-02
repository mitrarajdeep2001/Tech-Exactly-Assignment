/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Comment from '@/models/comment';

/**
 * Types
 */
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

type RequestBody = {
  content: string;
};

type RequestParams = {
  commentId: string;
};

/**
 * @function updateComment
 * @description Updates an existing comment.
 *              Expects `commentId` in params, `content` in body,
 *              and `userId` from authenticated request.
 */
const updateComment = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params as RequestParams;
  const { content } = req.body as RequestBody;
  const userId = req.userId;

  try {
    // 1️⃣ Find the comment
    const comment = await Comment.findById(commentId).select('_id user').exec();
    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found!',
      });
      return;
    }

    // 2️⃣ Authorization: only author can update
    if (!userId || !Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user id' });
      return;
    }

    if (!comment.user.equals(userId)) {
      res.status(403).json({
        code: 'Forbidden',
        message: 'You are not allowed to update this comment',
      });
      return;
    }

    // 3️⃣ Update comment content
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { content } },
      { new: true, runValidators: true },
    )
      .populate('user', 'username firstName lastName email')
      .lean()
      .exec();

    logger.info('Comment updated successfully', {
      commentId,
      updatedBy: userId,
    });

    // 4️⃣ Rename user → author for response
    const responseComment = {
      ...updatedComment,
      author: updatedComment?.user,
    };
    delete (responseComment as any).user;

    res.status(200).json({
      comment: responseComment,
    });
  } catch (err) {
    logger.error('Error during comment update', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
  }
};

export default updateComment;
