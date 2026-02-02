/**
 * Models
 */
import Blog from '@/models/blog';
import User from '@/models/user';

/**
 * Config
 */
import config from '@/config';

/**
 * Types
 */
import { Types } from 'mongoose';

interface GetBlogsParams {
  userId?: Types.ObjectId;
  blogId?: Types.ObjectId;
  page?: number;
  limit?: number;

  onlyOwnBlogs?: boolean;
}

interface QueryType {
  status?: 'draft' | 'published';
  _id?: Types.ObjectId;
  author?: any;
}

export const getBlogs = async ({
  userId,
  blogId,
  page = 1,
  limit = 10,
  onlyOwnBlogs = false,
}: GetBlogsParams) => {
  const offset = (page - 1) * limit;
  const user = userId
    ? await User.findById(userId).select('role').lean().exec()
    : null;

  const query: QueryType = {};

  if (blogId) {
    query._id = new Types.ObjectId(blogId);
  }

  if (onlyOwnBlogs && userId) {
    query.author = user?._id;
  }

  // if (includeOwnBlogs && userId) {
  //   query.$or = [{ author: user?._id }];
  // }

  if (!user || user.role === 'user') {
    query.status = 'published';
  }

  const total = await Blog.countDocuments(query);

  // ===============================
  // BLOGS WITH COMMENTS (aggregation)
  // ===============================
  const blogs = await Blog.aggregate([
    { $match: query },

    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
      },
    },
    { $unwind: '$author' },

    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'blog',
        as: 'comments',
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: 'comments.user',
        foreignField: '_id',
        as: 'commentUsers',
      },
    },

    {
      $addFields: {
        comments: {
          $map: {
            input: '$comments',
            as: 'comment',
            in: {
              _id: '$$comment._id',
              content: '$$comment.content',
              likesCount: '$$comment.likesCount',
              createdAt: '$$comment.createdAt',
              author: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$commentUsers',
                      as: 'u',
                      cond: { $eq: ['$$u._id', '$$comment.user'] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
    },

    {
      $project: {
        'author.password': 0,
        'author.__v': 0,
        commentUsers: 0,
        __v: 0,
        'banner.publicId': 0,
      },
    },

    { $sort: { publishedAt: -1 } },
    { $skip: offset },
    { $limit: limit },
  ]);

  return { page, limit, total, blogs };
};
