/**
 * Node modules
 */
import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;

  // ⬇️ password is optional for social login users
  password?: string;

  role: 'admin' | 'user';
  isActive: boolean;

  firstName?: string;
  lastName?: string;

  // ⬇️ OAuth related fields
  authProvider: 'local' | 'google' | 'facebook';
  providerId?: string;
  avatar?: string;

  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };

  notificationCount: number;
}

/**
 * User schema
 */
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      maxLength: 20,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      maxLength: 50,
      unique: true,
    },

    // ⬇️ NOT required anymore
    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    firstName: {
      type: String,
      maxLength: 20,
    },

    lastName: {
      type: String,
      maxLength: 20,
    },

    // ⬇️ NEW: auth provider info
    authProvider: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },

    providerId: {
      type: String,
      index: true,
    },

    avatar: {
      type: String,
    },

    socialLinks: {
      website: String,
      facebook: String,
      instagram: String,
      linkedin: String,
      x: String,
      youtube: String,
    },

    notificationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

/**
 * Password hashing
 * Only for LOCAL users
 */
userSchema.pre('save', async function (next) {
  if (this.authProvider !== 'local') return next();
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password!, 10);
  next();
});

export default model<IUser>('User', userSchema);
