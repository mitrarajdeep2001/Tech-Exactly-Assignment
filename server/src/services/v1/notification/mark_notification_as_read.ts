/**
 * Models
 */
import Notification from '@/models/notification';

/**
 * Types
 */
import { Types } from 'mongoose';

type MarkAsReadInput = {
  userId: string;
  notificationId?: string;
};

const markNotificationsAsRead = async ({
  userId,
  notificationId,
}: MarkAsReadInput) => {
  // ✅ Mark single notification
  if (notificationId) {
    if (!Types.ObjectId.isValid(notificationId)) {
      const err = new Error('Invalid notification id');
      (err as any).code = 'BadRequest';
      throw err;
    }

    const result = await Notification.updateOne(
      {
        _id: notificationId,
        recipient: userId, // 🔒 ownership check
      },
      { $set: { isRead: true } },
    );

    if (result.matchedCount === 0) {
      const err = new Error('Notification not found');
      (err as any).code = 'NotFound';
      throw err;
    }

    return { updated: 1 };
  }

  // ✅ Mark all notifications
  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true } },
  );

  return { updated: result.modifiedCount };
};

export default markNotificationsAsRead;
