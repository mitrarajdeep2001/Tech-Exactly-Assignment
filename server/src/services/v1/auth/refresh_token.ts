/**
 * Node modules
 */
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * Custom modules
 */
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Token from '@/models/token';
import User from '@/models/user';

/**
 * Types
 */
import { Types } from 'mongoose';

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    const err = new Error('Refresh token missing');
    (err as any).code = 'AuthenticationError';
    throw err;
  }

  // 1️⃣ Check token existence (DB-level revocation)
  const tokenExists = await Token.exists({ token: refreshToken });
  if (!tokenExists) {
    const err = new Error('Invalid refresh token');
    (err as any).code = 'AuthenticationError';
    throw err;
  }

  try {
    // 2️⃣ Verify refresh token JWT
    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    // 3️⃣ Generate new access token
    const accessToken = generateAccessToken(jwtPayload.userId);

    // 4️⃣ Fetch user (optional but useful for frontend rehydration)
    const user = await User.findById(jwtPayload.userId)
      .select('-__v')
      .lean()
      .exec();

    if (!user) {
      const err = new Error('User not found');
      (err as any).code = 'AuthenticationError';
      throw err;
    }

    logger.info('Access token refreshed', {
      userId: jwtPayload.userId,
    });

    return {
      accessToken,
      user,
    };
  } catch (err) {
    // Re-throw JWT-specific errors so controller can map status codes
    if (
      err instanceof TokenExpiredError ||
      err instanceof JsonWebTokenError
    ) {
      throw err;
    }

    logger.error('Error while refreshing access token', err);
    throw err;
  }
};
