/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Custom modules
 */
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { genUsername } from '@/utils';
import { logger } from '@/lib/winston';

/**
 * Models
 */
import User from '@/models/user';
import Token from '@/models/token';

/**
 * Config
 */
import config from '@/config';

/**
 * Types
 */
import type { IUser } from '@/models/user';

type RegisterInput = Pick<IUser, 'email' | 'password' | 'role'>;

export const registerUser = async ({
  email,
  password,
  role,
}: RegisterInput) => {
  // 🔐 Authorization rule belongs in service
  if (role === 'admin' && config.NODE_ENV !== "seed" && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    const error = new Error('You cannot register as an admin');
    (error as any).code = 'AuthorizationError';
    throw error;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const username = genUsername();

    // 1️⃣ Create user
    const newUser = await User.create(
      [
        {
          username,
          email,
          password,
          role,
        },
      ],
      { session },
    );

    // 2️⃣ Generate tokens
    const accessToken = generateAccessToken(newUser[0]._id);
    const refreshToken = generateRefreshToken(newUser[0]._id);

    // 3️⃣ Store refresh token
    await Token.create([{ token: refreshToken, userId: newUser[0]._id }], {
      session,
    });

    await session.commitTransaction();

    logger.info('User registered successfully', {
      userId: newUser[0]._id,
      email,
      role,
    });

    return {
      message: 'User registered successfully',
    };
  } catch (err) {
    await session.abortTransaction();
    logger.error('Error during user registration', err);
    throw err;
  } finally {
    session.endSession();
  }
};
