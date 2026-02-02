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
import type { IBlog } from '@/models/blog';
import { Types } from 'mongoose';

type UpdateBlogInput = {
  blogId: string;
  userId: string;
  title?: IBlog['title'];
  content?: IBlog['content'];
  banner?: IBlog['banner'];
  status?: IBlog['status'];
  removeBanner?: boolean;
};

/**
 * @function updateBlogService
 * @description Handles blog update business logic
 */
export const updateBlogService = async ({
  blogId,
  userId,
  title,
  content,
  banner,
  status,
  removeBanner,
}: UpdateBlogInput) => {
  // 1️⃣ Validate userId
  if (!userId || !Types.ObjectId.isValid(userId)) {
    const err = new Error('Invalid user id');
    (err as any).code = 'BadRequest';
    throw err;
  }

  // 2️⃣ Fetch user & blog
  const [user, blog] = await Promise.all([
    User.findById(userId).select('role').exec(),
    Blog.findById(blogId).select('-__v').exec(),
  ]);

  if (!blog) {
    const err = new Error('Blog not found');
    (err as any).code = 'NotFound';
    throw err;
  }

  // 3️⃣ Authorization (author or admin)
  if (!blog.author.equals(userId) && user?.role !== 'admin') {
    logger.warn('Unauthorized blog update attempt', {
      userId,
      blogId,
    });

    const err = new Error('Access denied, insufficient permissions');
    (err as any).code = 'AuthorizationError';
    throw err;
  }

  // 4️⃣ Apply updates (partial update)
  if (title !== undefined) blog.title = title;
  if (content !== undefined) blog.content = content;
  if (banner !== undefined) blog.banner = banner;
  if (status !== undefined) blog.status = status;

  if (removeBanner) {
    blog.banner = {
      publicId: '',
      url: '',
      width: 0,
      height: 0,
    };
  }

  // 5️⃣ Persist changes
  await blog.save();

  logger.info('Blog updated successfully', {
    blogId,
    updatedBy: userId,
  });

  return blog;
};
