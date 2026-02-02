/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';
import Comment from '@/models/comment';
import createNotification from '../notification/create_notification';

/**
 * Types
 */
type CreateCommentInput = {
  blogId: string;
  content: string;
  userId: string;
};

/**
 * @function createCommentService
 * @description Handles comment creation business logic
 */
export const createCommentService = async ({
  blogId,
  content,
  userId,
}: CreateCommentInput) => {
  // 1️⃣ Ensure blog exists
  const blog = await Blog.findById(blogId)
    .select('_id commentsCount author')
    .exec();

  if (!blog) {
    const err = new Error('Blog not found!');
    (err as any).code = 'NotFound';
    throw err;
  }

  // 2️⃣ Create comment
  const newComment = await Comment.create({
    blog: blogId,
    content,
    user: userId,
  });

  // 3️⃣ Populate author (user)
  const populatedComment = await Comment.findById(newComment._id)
    .populate('user', 'username firstName lastName email')
    .lean()
    .exec();

  // 4️⃣ Increment blog comments count
  await Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: 1 } });

  logger.info('New comment created', {
    commentId: newComment._id,
    blogId,
    userId,
  });

  // 5️⃣ Shape response (author instead of user)
  const comment = {
    ...populatedComment,
    author: populatedComment?.user,
  };

  delete (comment as any).user;

  if (blog.author.toString() !== userId) {
    // Notification service
    await createNotification({
      recipient: blog.author.toString(), // blog owner
      actor: userId, // commenter
      type: 'COMMENT',
      title: 'New comment',
      message: 'commented on your blog',
      entityType: 'Blog',
      entityId: blogId,
    });
  }

  return comment;
};
