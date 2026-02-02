/**
 * Node modules
 */
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Services
 */
import { refreshAccessToken } from '@/services/v1/auth/refresh_token';

/**
 * Types
 */
import type { Request, Response } from 'express';

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    const { accessToken, user } = await refreshAccessToken(refreshToken);

    if (!user.isActive) {
      const err = new Error('Your accoun is Inactive. Please contact admin.');
      (err as any).code = 'InactiveAccount';
      throw err;
    }
    res.status(200).json({
      accessToken,
      user,
    });
  } catch (err: any) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Refresh token expired, please login again',
      });
      return;
    }

    if (
      err instanceof JsonWebTokenError ||
      err.code === 'AuthenticationError'
    ) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }

    if (err.code === 'InactiveAccount') {
      res.status(403).json({
        code: err.code,
        message: err.message,
      });
      return;
    }

    logger.error('Error during refresh token', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

export default refreshToken;
