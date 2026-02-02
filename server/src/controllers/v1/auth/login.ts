/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Services
 */
import { loginUser } from '@/services/v1/auth/login';

/**
 * Config
 */
import config from '@/config';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as UserData;

  try {
    const { user, accessToken, refreshToken } = await loginUser({
      email,
      password,
    });

    // 🍪 HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      user,
      accessToken,
    });

    logger.info('User logged in successfully', {
      email: user.email,
    });
  } catch (err: any) {
    if (err.code === 'InvalidCredentials') {
      res.status(401).json({
        code: 'InvalidCredentials',
        message: err.message,
      });
      return;
    } else if (err.code === 'AuthProviderMismatch') {
      res.status(400).json({
        code: err.code,
        message: err.message,
      });
      return;
    }

    logger.error('Error during user login', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

export default login;
