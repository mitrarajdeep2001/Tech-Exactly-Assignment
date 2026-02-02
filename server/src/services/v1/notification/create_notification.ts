/**
 * Models
 */
import Notification from '@/models/notification';
import User from '@/models/user';
import { io } from '@/server';

/**
 * Types
 */
import { Types } from 'mongoose';
import getNotificationsCount from './fetch_notification_count';

type CreateNotificationInput = {
  recipient: string;
  actor?: string;
  type:
    | 'COMMENT'
    | 'REPLY'
    | 'LIKE'
    | 'BLOG_UPDATE'
    | 'PERMISSION_REQUEST'
    | 'SYSTEM';
  title: string;
  message: string;
  entityType?: 'Blog' | 'Comment' | 'User';
  entityId?: string;
};

const createNotification = async ({
  recipient,
  actor,
  type,
  title,
  message,
  entityType,
  entityId,
}: CreateNotificationInput) => {
  const noti = await Notification.create({
    recipient: new Types.ObjectId(recipient),
    actor: actor ? new Types.ObjectId(actor) : undefined,
    type,
    title,
    message,
    entityType,
    entityId: entityId ? new Types.ObjectId(entityId) : undefined,
  });

  await User.updateOne(
    { _id: new Types.ObjectId(recipient) },
    { $inc: { notificationCount: 1 } },
  );

  const unreadCount = await getNotificationsCount(
    new Types.ObjectId(recipient),
  );

  io.to(`user:${recipient}`).emit('notification:unread-count', unreadCount);
  return noti;
};

export default createNotification;
