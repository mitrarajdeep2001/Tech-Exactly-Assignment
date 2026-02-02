/**
 * Models
 */
import Notification from '@/models/notification';
import Blog from '@/models/blog';
import Comment from '@/models/comment';
import User from '@/models/user';

/**
 * Types
 */
import { Types } from 'mongoose';
import user from '@/models/user';

type GetNotificationsParams = {
  userId: string;
  page?: number;
  limit?: number;
};

export const getNotificationsForUser = async ({
  userId,
  page = 1,
  limit = 10,
}: GetNotificationsParams) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ recipient: userId })
      .populate('actor', 'username firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),

    Notification.countDocuments({ recipient: userId }),
  ]);

  // 🔁 Populate entity dynamically
  const enrichedNotifications = await Promise.all(
    notifications.map(async (notification) => {
      if (!notification.entityType || !notification.entityId) {
        return notification;
      }

      let entity = null;

      switch (notification.entityType) {
        case 'Blog':
          entity = await Blog.findById(notification.entityId)
            .select('title slug')
            .lean()
            .exec();
          break;

        case 'Comment':
          entity = await Comment.findById(notification.entityId)
            .select('content blog')
            .lean()
            .exec();
          break;

        case 'User':
          entity = await User.findById(notification.entityId)
            .select('username firstName lastName')
            .lean()
            .exec();
          break;
      }

      return {
        ...notification,
        entity,
      };
    }),
  );

  await User.updateOne(
    { _id: new Types.ObjectId(userId) },
    { notificationCount: 0 },
  );
  return {
    page,
    limit,
    total,
    notifications: enrichedNotifications,
  };
};
