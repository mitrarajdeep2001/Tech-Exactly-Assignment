import User from '@/models/user';
import { Types } from 'mongoose';

const getNotificationsCount = async (userId: Types.ObjectId) => {
  return User.findById(userId).select('notificationCount').exec();
};

export default getNotificationsCount;
