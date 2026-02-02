/**
 * Custom modules
 */
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import bcrypt from 'bcrypt';

/**
 * Models
 */
import User from '@/models/user';
import Token from '@/models/token';

/**
 * Types
 */
import type { IUser } from '@/models/user';

type LoginInput = Pick<IUser, 'email' | 'password'>;

export const loginUser = async ({ email, password }: LoginInput) => {
  // 1️⃣ Find active user
  const user = await User.findOne({ email, isActive: true })
    .select('username email password role authProvider')
    .lean()
    .exec();

  if (!user) {
    const err = new Error('Invalid email or password');
    (err as any).code = 'InvalidCredentials';
    throw err;
  }

  if (!user.password && user.authProvider !== 'local') {
    const err = new Error(
      'Login with registered auth provider (Google / Facebook)',
    );
    (err as any).code = 'AuthProviderMismatch';
    throw err;
  }
  // 2️⃣ Compare password
  const isPasswordMatch = await bcrypt.compare(password!, user.password!);

  if (!isPasswordMatch) {
    const err = new Error('Invalid email or password');
    (err as any).code = 'InvalidCredentials';
    throw err;
  }

  // 3️⃣ Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // 4️⃣ Store refresh token
  const tokenDoc = await Token.create({
    token: refreshToken,
    userId: user._id,
  });

  logger.info('Refresh token created for user', {
    userId: user._id,
    tokenId: tokenDoc._id,
  });

  return {
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};
