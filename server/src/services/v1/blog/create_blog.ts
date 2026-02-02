/**
 * Node modules
 */
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';

/**
 * Types
 */
import type { IBlog } from '@/models/blog';

type CreateBlogInput = Pick<
  IBlog,
  'title' | 'content' | 'banner' | 'status'
> & {
  authorId: string;
};

/**
 * DOMPurify setup (service-level, reusable)
 */
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * @function createBlogService
 * @description Handles blog creation logic
 */
export const createBlogService = async ({
  title,
  content,
  banner,
  status,
  authorId,
}: CreateBlogInput) => {
  // 🧼 Sanitize content (business rule)
  const cleanContent = purify.sanitize(content);

  // 📝 Create blog
  const newBlog = await Blog.create({
    title,
    content: cleanContent,
    banner,
    status,
    author: authorId,
  });

  logger.info('New blog created', {
    blogId: newBlog._id,
    authorId,
  });

  return newBlog;
};
