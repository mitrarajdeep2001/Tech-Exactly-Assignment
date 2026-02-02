export type FormData = {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};
export type FormErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};
export type UserRole = "ADMIN" | "USER";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "ADMIN" | "USER";
  isActive: boolean;
  notificationCount: number
  createdAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    email: string;
  };
  banner: {
    url: string;
  };
  status: "draft" | "published" | "deleted";
  publishedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    email: string;
  };
  publishedAt: string;
}

export interface FeedPost {
  _id: string;
  title: string;
  content: string;
  commentsCount: number;
  banner: {
    url: string;
  };
  author: {
    _id: string;
    email: string;
    role: UserRole;
  };
  comments: Comment[];
  status: "draft" | "published" | "deleted";
  publishedAt: string;
}

export interface PostInput {
  _id: string;
  title: string;
  content: string;
  banner?: File | string | undefined;
  authorId?: string;
}

export interface AnalyticsData {
  totalUsers: number;
  totalBlogs: number;
  totalComments: number;
}

export type NotificationType =
  | "COMMENT"
  | "REPLY"
  | "LIKE"
  | "BLOG_UPDATE"
  | "PERMISSION_REQUEST"
  | "SYSTEM";

export type EntityType = "Blog" | "Comment" | "User";

export interface INotificationActor {
  _id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface IBlogEntity {
  _id: string;
  title: string;
  slug?: string;
}

export interface ICommentEntity {
  _id: string;
  content: string;
}

export interface IUserEntity {
  _id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export type NotificationEntity = IBlogEntity | ICommentEntity | IUserEntity;

export interface INotification {
  _id: string;

  recipient: string; // userId (logged-in user)

  actor?: INotificationActor; // who triggered the notification

  type: NotificationType;

  title: string;
  message: string;

  entityType?: EntityType;
  entityId?: string;
  entity?: NotificationEntity;

  isRead: boolean;

  createdAt: string; // ISO date string
}
