/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Custom modules
 */
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Token from '@/models/token';

/**
 * Config
 */
import config from '@/config';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

const googleCallback = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as IUser;

  if (!user) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Google authentication failed',
    });
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 2️⃣ Store refresh token
    await Token.create(
      [{ token: refreshToken, userId: user._id }],
      { session },
    );

    // 3️⃣ Commit transaction
    await session.commitTransaction();

    // 4️⃣ Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    logger.info('Google login successful', {
      userId: user._id,
      email: user.email,
    });

    // 5️⃣ Redirect to client with access token
    res.redirect(
      `${config.CLIENT_URL}/feed`,
    );
  } catch (err) {
    await session.abortTransaction();

    logger.error('Error during Google OAuth callback', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  } finally {
    session.endSession();
  }
};

export default googleCallback;
