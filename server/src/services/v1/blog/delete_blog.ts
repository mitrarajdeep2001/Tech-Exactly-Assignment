/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';
import User from '@/models/user';

/**
 * Types
 */
import { Types } from 'mongoose';

type DeleteBlogInput = {
  blogId: string;
  userId: string;
};

/**
 * @function deleteBlogService
 * @description Handles blog deletion business logic
 */
export const deleteBlogService = async ({
  blogId,
  userId,
}: DeleteBlogInput): Promise<void> => {
  // 1️⃣ Validate userId
  if (!userId || !Types.ObjectId.isValid(userId)) {
    const err = new Error('Invalid user id');
    (err as any).code = 'BadRequest';
    throw err;
  }

  // 2️⃣ Fetch user & blog
  const [user, blog] = await Promise.all([
    User.findById(userId).select('role').exec(),
    Blog.findById(blogId).select('author banner.publicId').exec(),
  ]);

  if (!blog) {
    const err = new Error('Blog not found');
    (err as any).code = 'NotFound';
    throw err;
  }

  // 3️⃣ Authorization (author or admin)
  if (!blog.author.equals(userId) && user?.role !== 'admin') {
    logger.warn('Unauthorized blog delete attempt', {
      userId,
      blogId,
    });

    const err = new Error('Access denied, insufficient permissions');
    (err as any).code = 'AuthorizationError';
    throw err;
  }

  // 4️⃣ Soft delete blog
  await Blog.updateOne(
    { _id: blogId },
    { status: 'deleted' }
  );

  logger.info('Blog deleted successfully', {
    blogId,
    deletedBy: userId,
  });
};
