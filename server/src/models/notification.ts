/**
 * Node modules
 */
import { Schema, model, Types } from 'mongoose';

export type NotificationType =
  | 'COMMENT'
  | 'REPLY'
  | 'LIKE'
  | 'BLOG_UPDATE'
  | 'PERMISSION_REQUEST'
  | 'SYSTEM';

export interface INotification {
  recipient: Types.ObjectId;     // Who receives the notification
  actor?: Types.ObjectId;        // Who triggered it (optional for system)
  type: NotificationType;

  title: string;                 // Short heading
  message: string;               // Full message shown in UI

  entityType?: 'Blog' | 'Comment' | 'User';
  entityId?: Types.ObjectId;     // Blog ID / Comment ID etc.

  isRead: boolean;
  createdAt: Date;
}

/**
 * Notification schema
 */
const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    actor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    type: {
      type: String,
      enum: [
        'COMMENT',
        'REPLY',
        'LIKE',
        'BLOG_UPDATE',
        'PERMISSION_REQUEST',
        'SYSTEM',
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      maxLength: 100,
    },

    message: {
      type: String,
      required: true,
      maxLength: 300,
    },

    entityType: {
      type: String,
      enum: ['Blog', 'Comment', 'User'],
    },

    entityId: {
      type: Schema.Types.ObjectId,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export default model<INotification>(
  'Notification',
  notificationSchema
);
